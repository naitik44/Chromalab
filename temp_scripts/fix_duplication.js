const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/tools/color-palettes/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file contains TWO "use client" blocks.
// The first one is the start of the file.
// The second one is where the file was accidentally duplicated.
const useClientIndex = content.lastIndexOf('"use client";');
if (useClientIndex > 0) {
    // The duplicated string is exactly what was appended.
    // The first part of the file is the valid modified file up to newPresets, plus the entire original file appended.
    
    // We want the JS part (from the start of the file up to the end of the script).
    // The script is inside the first part.
    // Wait, let's just find the first `dangerouslySetInnerHTML={{ __html: \``
    
    const htmlStartMarker = 'dangerouslySetInnerHTML={{ __html: `';
    let htmlStart = content.indexOf(htmlStartMarker);
    if (htmlStart === -1) {
       htmlStart = content.indexOf('dangerouslySetInnerHTML={{ __html: "');
    }
    
    // JS part: from 0 to htmlStart
    const jsPart = content.substring(0, htmlStart);
    
    // Now, the HTML content should be:
    // From htmlStart, up to the end of my new presets.
    const oceanDepthsEndMarker = '<!-- Card 6: Ocean Depths -->';
    const oceanDepthsIndex = content.indexOf(oceanDepthsEndMarker);
    const endOfNewPresets = content.indexOf('</section>', oceanDepthsIndex) + 10;
    
    const htmlPart1 = content.substring(htmlStart, endOfNewPresets);
    
    // And then the footer, which starts at `<!-- Global Toast Notification Component -->` in the DUPLICATED part.
    const toastMarker = '<!-- Global Toast Notification Component -->';
    const lastToastIndex = content.lastIndexOf(toastMarker);
    
    // We take from lastToastIndex to the end of the file.
    const htmlPart2 = content.substring(lastToastIndex);
    
    // Wait, the end of the file has `"}}` or \`}} from my fix script.
    // Let's just concatenate them.
    const finalContent = jsPart + htmlPart1 + '\\n' + htmlPart2;
    
    fs.writeFileSync(filePath, finalContent);
    console.log('Fixed duplication!');
} else {
    console.log('No duplication found.');
}
