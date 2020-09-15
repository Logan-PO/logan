const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.end('Hello world!');
});

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
});
