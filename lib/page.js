const fs = require('fs');
const path = require('path');

const SECTION_ORDER = [
    'navbar',
    'hero',
    'about-miqnaf',
    'drug-profile',
    'moa',
    'lineage',
    'resistance-map',
    'clinical-experience',
    'doctor',
    'stats',
    'footer'
];

/* The interactive 3D lineage sits on its own page, linked from the mechanism
   section, so it keeps the navbar, footer and styles without loading 3Dmol on
   the main page. */
const PAGES = {
    'molecular-lineage.html': {
        sections: ['navbar', 'lineage-3d', 'footer'],
        title: 'The macrolide lineage in 3D — MIQNAF (Nafithromycin)',
        description: 'Azithromycin, clarithromycin and nafithromycin as interactive 3D structures, '
            + 'with the motifs carried forward or dropped as the scaffold evolves into a ketolide. '
            + 'For medical professionals only.'
    }
};

function render(root, names, meta) {
    const sections = names.map((name) => {
        const filePath = path.join(root, 'sections', `${name}.html`);
        return fs.readFileSync(filePath, 'utf-8');
    }).join('\n\n');

    let layout = fs.readFileSync(path.join(root, 'layouts', 'main.html'), 'utf-8');
    if (meta && meta.title) {
        layout = layout.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);
    }
    if (meta && meta.description) {
        layout = layout.replace(/(<meta name="description" content=")[\s\S]*?(">)/,
            `$1${meta.description}$2`);
    }
    return layout.replace('{{SECTIONS}}', sections);
}

function buildPage(rootDir) {
    const root = rootDir || path.join(__dirname, '..');
    return render(root, SECTION_ORDER);
}

function buildExtraPages(rootDir) {
    const root = rootDir || path.join(__dirname, '..');
    return Object.keys(PAGES).map((file) => ({
        file,
        html: render(root, PAGES[file].sections, PAGES[file])
    }));
}

module.exports = { buildPage, buildExtraPages, SECTION_ORDER, PAGES };
