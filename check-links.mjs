import fs from 'fs';

const content = fs.readFileSync('src/app/page.tsx', 'utf8');
console.log('Has / directory link:', content.includes('href=\\"/\\"'));
console.log('Has font checker link:', content.includes('href=\\"/tools/font-checker\\"'));
