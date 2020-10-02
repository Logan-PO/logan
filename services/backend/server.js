const express = require('express');
const cors = require('cors');
const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

const corsConfiguration = {
    origin: ['http://localhost:8000', 'http://logan-frontend.s3-website-us-west-2.amazonaws.com'],
};

app.use(cors(corsConfiguration));
router.route(app);

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
