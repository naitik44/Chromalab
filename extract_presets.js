const fs = require('fs');
const code = fs.readFileSync('neat.js', 'utf8');
const match = code.match(/\{colors:\[.*?\],speed:.*?\}/g);

if (!match) {
    console.error("No presets found");
    process.exit(1);
}

// Convert JS object literals with !0 to valid JSON
let jsonArray = match.map(str => {
    // Basic replacements
    let s = str
        .replace(/!0/g, 'true')
        .replace(/!1/g, 'false');
    
    // Evaluate safely
    let obj = new Function("return " + s)();
    return obj;
});

// Create a nice JS file to export
let output = `export const neatPresets = ${JSON.stringify(jsonArray, null, 2)};\n`;
fs.writeFileSync('src/app/tools/mesh-gradient-studio/presets.ts', output);
console.log(`Saved ${jsonArray.length} presets to src/app/tools/mesh-gradient-studio/presets.ts`);
