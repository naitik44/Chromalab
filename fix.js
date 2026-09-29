const fs = require('fs');
let content = fs.readFileSync('src/app/tools/gradient-builder/page.tsx', 'utf8');
content = content.replace(/\\\`/g, '`');
content = content.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/tools/gradient-builder/page.tsx', content);
