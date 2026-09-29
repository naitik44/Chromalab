const fs = require('fs');
const path = require('path');

function processDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('page.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove Submit Resource button
      content = content.replace(/<button class=\\"flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-\[0_0_16px_rgba\(6,182,212,0\.25\)\] hover:bg-primary transition-all\\" type=\\"button\\"><span class=\\"material-symbols-outlined text-body-lg\\">add<\/span>(<span\s*>)?Submit Resource(<\/span>)?<\/button>/g, '');
      
      // Remove Search button
      content = content.replace(/<button class=\\"hidden md:flex items-center gap-space-sm h-10 px-space-md rounded-lg bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors\\" type=\\"button\\"><span class=\\"material-symbols-outlined text-body-lg\\">search<\/span><span class=\\"font-body-sm text-body-sm\\">Search tools, fonts, shaders\.\.\.<\/span><kbd class=\\"px-1\.5 py-0\.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant\\">⌘K<\/kbd><\/button>/g, '');
      
      fs.writeFileSync(fullPath, content);
      console.log('Cleaned', fullPath);
    }
  });
}

processDir(path.join(__dirname, '../src/app'));
