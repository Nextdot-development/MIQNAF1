const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const SECTION_ORDER = [
    'navbar',
    'hero',
    'trust',
    'clinical-experience',
    'doctor',
    'about-miqnaf',
    'stats',
    'footer'
];

function loadSections() {
    return SECTION_ORDER.map((name) => {
        const filePath = path.join(ROOT, 'sections', `${name}.html`);
        return fs.readFileSync(filePath, 'utf-8');
    }).join('\n\n');
}

function buildPage() {
    const layout = fs.readFileSync(path.join(ROOT, 'layouts', 'main.html'), 'utf-8');
    const sections = loadSections();
    return layout.replace('{{SECTIONS}}', sections);
}

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
