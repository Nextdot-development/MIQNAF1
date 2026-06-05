const fs = require('fs');
const path = require('path');
const { buildPage } = require('./lib/page');

const ROOT = __dirname;
const html = buildPage(ROOT);

fs.writeFileSync(path.join(ROOT, 'index.html'), html, 'utf-8');
console.log('✅ Built index.html for deployment');
