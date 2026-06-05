const fs = require('fs');
const path = require('path');

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

function buildPage(rootDir) {
    const root = rootDir || path.join(__dirname, '..');
    const sections = SECTION_ORDER.map((name) => {
        const filePath = path.join(root, 'sections', `${name}.html`);
        return fs.readFileSync(filePath, 'utf-8');
    }).join('\n\n');

    const layout = fs.readFileSync(path.join(root, 'layouts', 'main.html'), 'utf-8');
    return layout.replace('{{SECTIONS}}', sections);
}

module.exports = { buildPage, SECTION_ORDER };
