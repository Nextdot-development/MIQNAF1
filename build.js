const fs = require('fs');
const path = require('path');
const { buildPage, buildExtraPages } = require('./lib/page');

const ROOT = __dirname;

fs.writeFileSync(path.join(ROOT, 'index.html'), buildPage(ROOT), 'utf-8');
console.log('✅ Built index.html for deployment');

buildExtraPages(ROOT).forEach(({ file, html }) => {
    fs.writeFileSync(path.join(ROOT, file), html, 'utf-8');
    console.log(`✅ Built ${file}`);
});
