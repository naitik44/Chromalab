import fs from 'fs';
import path from 'path';

const files = [
  'src/app/page.tsx',
  'src/app/tools/font-checker/page.tsx',
  'src/app/tools/gradient-builder/page.tsx',
  'src/app/tools/color-palettes/page.tsx'
];

files.forEach(file => {
  const filePath = path.join('E:\\Naitik\\Chromalab\\chroma-lab', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // We need to replace links in the JSON escaped string!
  // e.g. data-path=\"directory\" href=\"#\"
  // or href=\"#\" data-path=\"directory\"
  
  content = content.replace(/href=\\"#\\" data-path=\\"directory\\"/g, 'href=\\"/\\"');
  content = content.replace(/data-path=\\"directory\\" href=\\"#\\"/g, 'href=\\"/\\"');
  
  content = content.replace(/href=\\"#\\" data-path=\\"font-checker\\"/g, 'href=\\"/tools/font-checker\\"');
  content = content.replace(/data-path=\\"font-checker\\" href=\\"#\\"/g, 'href=\\"/tools/font-checker\\"');
  
  content = content.replace(/href=\\"#\\" data-path=\\"gradient-builder\\"/g, 'href=\\"/tools/gradient-builder\\"');
  content = content.replace(/data-path=\\"gradient-builder\\" href=\\"#\\"/g, 'href=\\"/tools/gradient-builder\\"');
  
  content = content.replace(/href=\\"#\\" data-path=\\"color-palettes\\"/g, 'href=\\"/tools/color-palettes\\"');
  content = content.replace(/data-path=\\"color-palettes\\" href=\\"#\\"/g, 'href=\\"/tools/color-palettes\\"');
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed', file);
});
