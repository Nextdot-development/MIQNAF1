const express = require('express');
const path = require('path');
const { buildPage } = require('./lib/page');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

app.get('/', (req, res) => {
    res.type('html').send(buildPage());
});

app.get('/index.html', (req, res) => {
    res.type('html').send(buildPage());
});

app.use(express.static(ROOT, { index: false }));

app.listen(PORT, () => {
    console.log(`MIQNAF website running at http://localhost:${PORT}`);
});
