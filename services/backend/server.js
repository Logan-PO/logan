const express = require('express');
const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

router.route(app);

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
