exports.handler = async (event) => {
    console.info(`Received: ${event}`);
    return {
        statusCode: 200,
        body: JSON.stringify({
            event,
            message: 'Hello world!',
        }),
    };
};
