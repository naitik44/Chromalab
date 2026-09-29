const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/tools/color-palettes/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The original file starts with `dangerouslySetInnerHTML={{ __html: "<header`
// We need to change that `"` to \` and the very last `"` to \`

const htmlStartStr = 'dangerouslySetInnerHTML={{ __html: "';
const startIdx = content.indexOf(htmlStartStr);

if (startIdx !== -1) {
  content = content.substring(0, startIdx) + 'dangerouslySetInnerHTML={{ __html: `' + content.substring(startIdx + htmlStartStr.length);
  
  // Now find the end. The end should be `"}}` near the end of the file.
  // We can just replace the last `"}}` with `\n\`}}`
  const lastIndex = content.lastIndexOf('"}}');
  if (lastIndex !== -1) {
    content = content.substring(0, lastIndex) + '\`}}' + content.substring(lastIndex + 3);
  }
}

// Ensure there are no unescaped `${` which would try to evaluate variables
content = content.replace(/\$\{/g, '\\${');

fs.writeFileSync(filePath, content);
console.log('Fixed syntax by switching to template literal!');
