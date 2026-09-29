const fs = require('fs');

const code = fs.readFileSync('neat.js', 'utf8');
const startIdx = code.indexOf('Yg={Neat:Jg');

let endIdx = -1;
let brackets = 0;
for (let i = startIdx + 3; i < code.length; i++) {
    if (code[i] === '{') brackets++;
    if (code[i] === '}') brackets--;
    if (brackets === 0) {
        endIdx = i + 1;
        break;
    }
}

let objStr = code.substring(startIdx + 3, endIdx); 

// The first preset is Jg, which is defined before this. Let's just find the first `colors:[` in the file.
const jgStart = code.lastIndexOf('colors:[', startIdx);
let jgBrackets = 0;
let jgEndIdx = code.indexOf('shapeType:`plane`,cameraLock:!0}', jgStart) + 32;
let jgStr = code.substring(jgStart - 1, jgEndIdx);

let jsCode = `
    const Jg = ${jgStr.replace(/!0/g, 'true').replace(/!1/g, 'false').replace(/`/g, '"')};
    const Yg = ${objStr.replace(/!0/g, 'true').replace(/!1/g, 'false').replace(/`/g, '"')};
    return Yg;
`;

let presetsObj = new Function(jsCode)();

let presetsArray = [];
for (const [name, config] of Object.entries(presetsObj)) {
    let actualConfig = config;
    if (config.colors === undefined) {
        // If it's a reference like {Neat: Jg}
        actualConfig = Object.values(config)[0];
    }
    actualConfig.name = name;
    presetsArray.push(actualConfig);
}

let output = `export const neatPresets = ${JSON.stringify(presetsArray, null, 2)};\n`;
fs.writeFileSync('src/app/tools/mesh-gradient-studio/presets.ts', output);
console.log(`Saved ${presetsArray.length} presets with names!`);
