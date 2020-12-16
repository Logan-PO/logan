const _ = require('lodash');
const { dynamoUtils } = require('@logan/aws');
const {
    dateUtils: {
        dayjs,
        constants: { DB_DATE_FORMAT },
    },
} = require('@logan/core');
const { v4: uuid } = require('uuid');
const Promise = require('bluebird');
const requestValidator = require('../../utils/request-validator');
const { NotFoundError } = require('../../utils/errors');
const { makeHandler } = require('../../utils/wrap-handler');
const coursesController = require('./courses-controller');

function fromDbFormat(db) {
    return {
        ..._.pick(db, ['uid', 'tid', 'title']),
        startDate: db.sd,
        endDate: db.ed,
    };
}

function toDbFormat(term) {
    return {
        ..._.pick(term, ['uid', 'tid', 'title']),
        sd: dayjs(term.startDate).format(DB_DATE_FORMAT),
        ed: dayjs(term.endDate).format(DB_DATE_FORMAT),
    };
}
 
const getTerm = makeHandler({
	config: { authRequired: true },
	handler: async event => {
    	const requestedTid = req.params.tid;

    	const dbResponse = await dynamoUtils.get({
        	TableName: dynamoUtils.TABLES.TERMS,
        	Key: { tid: requestedTid },
    	});

    	if (dbResponse.Item) {
        	return fromDbFormat(dbResponse.Item);
    	} else {
        	throw new NotFoundError('Term does not exist');
    	}
    },
});

const getTerms = makeHandler({
	config: { authRequired: true },
	handler: async event => {
    	const requestedBy = event.auth.uid;

    	const dbResponse = await dynamoUtils.scan({
        	TableName: dynamoUtils.TABLES.TERMS,
        	FilterExpression: 'uid = :uid',
        	ExpressionAttributeValues: { ':uid': requestedBy },
    	});

   		return dbResponse.Items.map(fromDbFormat);
   	},
});

const createTerm = makeHandler({
	config: { authRequired: true },
	handler: async event => {
    	const tid = uuid();

    	const term = _.merge({}, event.body, { tid }, _.pick(event.auth, ['uid']));

    	requestValidator.requireBodyParams(event, ['title', 'startDate', 'endDate']);

    	await dynamoUtils.put({
        	TableName: dynamoUtils.TABLES.TERMS,
        	Item: toDbFormat(term),
    	});

    	return term;
    },
});

const updateTerm = makeHandler({
	config: { authRequired: true },
	handler: async event => {
    	const term = _.merge({}, event.body, event.pathParameters, _.pick(event.auth, ['uid']));

    	requestValidator.requireBodyParams(event, ['title', 'startDate', 'endDate']);

    	await dynamoUtils.put({
        	TableName: dynamoUtils.TABLES.TERMS,
        	Item: toDbFormat(term),
        	ExpressionAttributeValues: { ':uid': event.auth.uid },
        	ConditionExpression: 'uid = :uid',
    	});

    	res.json(term);
    },
});

const deleteTerm = makeHandler({
	config: { authRequired: true },
	handler: async event => {
    	const requestedTid = event.pathParameters.tid;

    	await dynamoUtils.delete({
        	TableName: dynamoUtils.TABLES.TERMS,
        	Key: { tid: requestedTid },
        	ExpressionAttributeValues: { ':uid': event.auth.uid },
        	ConditionExpression: 'uid = :uid',
    	});

    	await handleCascadingDeletes(requestedTid);

    	return { success: true };
    },
});

async function handleCascadingDeletes(tid) {
    // Delete courses
    const { Items: courses } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.COURSES,
        ExpressionAttributeValues: { ':tid': tid },
        FilterExpression: ':tid = tid',
        AutoPaginate: true,
    });

    const courseDeletes = dynamoUtils.makeDeleteRequests(courses, 'cid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.COURSES]: courseDeletes });

    await Promise.map(courses, ({ cid }) => coursesController.handleCascadingDeletes(cid), { concurrency: 3 });

    // Delete holidays
    const { Items: holidays } = await dynamoUtils.scan({
        TableName: dynamoUtils.TABLES.HOLIDAYS,
        ExpressionAttributeValues: { ':tid': tid },
        FilterExpression: ':tid = tid',
        AutoPaginate: true,
    });

    const holidayDeletes = dynamoUtils.makeDeleteRequests(holidays, 'hid');
    await dynamoUtils.batchWrite({ [dynamoUtils.TABLES.HOLIDAYS]: holidayDeletes });
}

module.exports = {
    __test_only__: { fromDbFormat, toDbFormat },
    getTerm,
    getTerms,
    createTerm,
    updateTerm,
    deleteTerm,
};
