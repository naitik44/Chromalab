const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/tools/color-palettes/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix Event Delegation for Lock Toggle
// We replace the old document.querySelectorAll('.lock-toggle') with event delegation
const oldLockScript = `    // Toggle Swatch Lock status
    document.querySelectorAll('.lock-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const icon = btn.querySelector('.material-symbols-outlined');
        const isLocked = icon.textContent.trim() === 'lock';
        if (isLocked) {
          icon.textContent = 'lock_open';
          icon.classList.remove('text-tertiary');
        } else {
          icon.textContent = 'lock';
          icon.classList.add('text-tertiary');
        }
      });
    });`;

const newLockScript = `    // Toggle Swatch Lock status via Event Delegation
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.lock-toggle');
      if (btn) {
        e.stopPropagation();
        const icon = btn.querySelector('.material-symbols-outlined');
        const isLocked = icon.textContent.trim() === 'lock';
        if (isLocked) {
          icon.textContent = 'lock_open';
          icon.classList.remove('text-tertiary');
        } else {
          icon.textContent = 'lock';
          icon.classList.add('text-tertiary');
        }
      }
    });`;
content = content.replace(oldLockScript, newLockScript);

// 2. Allow manual hex editing
// Change onclick="navigator.clipboard.writeText('#06B6D4'); notifyCopied('#06B6D4');" on the big texts
content = content.replace(/onclick="navigator\.clipboard\.writeText\('([^']+)'\); notifyCopied\('([^']+)'\);"/g, (match, hex1, hex2) => {
  return `onclick="window.promptEditColor(this, '${hex1}')"`;
});

// Add promptEditColor to the JS block
const promptEditColorScript = `
    window.promptEditColor = function(element, oldHex) {
      let newHex = prompt('Enter a new HEX color (e.g. #FF5500):', oldHex);
      if (newHex && /^#[0-9A-F]{6}$/i.test(newHex)) {
        newHex = newHex.toUpperCase();
        element.textContent = newHex;
        const col = element.closest('.palette-column');
        if (col) {
          col.style.backgroundColor = newHex;
          col.setAttribute('data-hex', newHex);
        }
        window.notifyCopied('Color updated to ' + newHex);
      } else if (newHex) {
        alert('Invalid HEX format! Use #RRGGBB');
      }
    };
`;
if (!content.includes('window.promptEditColor')) {
    content = content.replace('window.regenerateHarmonies = function regenerateHarmonies()', promptEditColorScript + '\n    window.regenerateHarmonies = function regenerateHarmonies()');
}

// 3. Harmony Math in regenerateHarmonies
const oldRegen = `        const newColor = getRandomHex();
        col.style.backgroundColor = newColor;
        col.setAttribute('data-hex', newColor);
        const hexDisplay = col.querySelector('.font-headline-lg');
        if (hexDisplay) hexDisplay.textContent = newColor;`;

// We inject a more complex harmony logic
const harmonyLogic = `
    function HSLToHex(h, s, l) {
      s /= 100; l /= 100;
      let c = (1 - Math.abs(2 * l - 1)) * s,
          x = c * (1 - Math.abs((h / 60) % 2 - 1)),
          m = l - c/2, r = 0, g = 0, b = 0;
      if (0 <= h && h < 60) { r = c; g = x; b = 0; }
      else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
      else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
      else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
      else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
      else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
      let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
      let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
      let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
      return \`#\${rHex\${gHex}\${bHex}\`.toUpperCase();
    }
    
    function hexToHSL(H) {
      let r = 0, g = 0, b = 0;
      if (H.length == 7) { r = parseInt(H.substring(1,3),16); g = parseInt(H.substring(3,5),16); b = parseInt(H.substring(5,7),16); }
      r /= 255; g /= 255; b /= 255;
      let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
      if (delta == 0) h = 0; else if (cmax == r) h = ((g - b) / delta) % 6; else if (cmax == g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4;
      h = Math.round(h * 60); if (h < 0) h += 360;
      l = (cmax + cmin) / 2;
      s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
      s = +(s * 100).toFixed(1); l = +(l * 100).toFixed(1);
      return [h, s, l];
    }
`;

if (!content.includes('HSLToHex')) {
    content = content.replace('window.regenerateHarmonies = function regenerateHarmonies()', harmonyLogic + '\n    window.regenerateHarmonies = function regenerateHarmonies()');
}

// Replace the regenerate logic
const newRegenLogic = `
    window.regenerateHarmonies = function regenerateHarmonies() {
      const columns = Array.from(document.querySelectorAll('.palette-column'));
      const select = document.getElementById('harmonySelect');
      const harmony = select ? select.value : 'random';
      
      let baseHsl = null;
      // find first locked color to use as base
      const lockedCol = columns.find(c => {
         const icon = c.querySelector('.lock-toggle .material-symbols-outlined');
         return icon && icon.textContent.trim() === 'lock';
      });
      if (lockedCol) {
         baseHsl = hexToHSL(lockedCol.getAttribute('data-hex') || '#06B6D4');
      } else {
         baseHsl = hexToHSL(getRandomHex());
      }
      
      columns.forEach((col, idx) => {
        const lockIcon = col.querySelector('.lock-toggle .material-symbols-outlined');
        if (lockIcon && lockIcon.textContent.trim() === 'lock') {
          return; // Locked swatch, skip
        }
        
        let newColor = getRandomHex();
        if (harmony !== 'random') {
           let [h, s, l] = baseHsl;
           if (harmony === 'analogous') h = (h + (idx * 30)) % 360;
           else if (harmony === 'complementary') h = (h + (idx % 2 === 0 ? 0 : 180)) % 360;
           else if (harmony === 'triadic') h = (h + (idx * 120)) % 360;
           else if (harmony === 'tetradic') h = (h + (idx * 90)) % 360;
           else if (harmony === 'split') h = (h + (idx === 0 ? 0 : (idx % 2 === 0 ? 150 : 210))) % 360;
           else if (harmony === 'monochromatic') l = Math.max(10, Math.min(90, l + (idx * 15 - 30)));
           
           newColor = HSLToHex(h, s, l);
        }

        col.style.backgroundColor = newColor;
        col.setAttribute('data-hex', newColor);
        const hexDisplay = col.querySelector('.font-headline-lg');
        if (hexDisplay) {
            hexDisplay.textContent = newColor;
            hexDisplay.setAttribute('onclick', \`window.promptEditColor(this, '\${newColor}')\`);
        }
      });
      window.notifyCopied('Palette Harmonized');
    };`;

content = content.replace(/window\.regenerateHarmonies = function regenerateHarmonies\(\) \{[\s\S]*?    \};/m, newRegenLogic);

// 4. Source Tone click handlers for 50-950 ramp
const rampLogic = `
    // Source Tone Ramp Click
    document.addEventListener('click', (e) => {
      if (e.target.closest('[title="Cyan (Primary)"], [title="Indigo (Accent)"], [title="Fuchsia (Highlight)"], [title="Emerald (Success)"]')) {
        const btn = e.target.closest('button');
        const color = btn.className.match(/bg-\\[(#[^\\]]+)\\]/);
        if (color && color[1]) {
           const hex = color[1];
           const [h, s, l] = hexToHSL(hex);
           // Update the 11 chips
           const chips = document.querySelectorAll('.grid-cols-2.sm\\:grid-cols-4 > div');
           const lumSteps = [96, 92, 86, 78, 70, 68, 52, 42, 33, 25, 14];
           chips.forEach((chip, i) => {
              const newL = lumSteps[i] || 50;
              const newHex = HSLToHex(h, s, newL);
              const colorBox = chip.querySelector('.h-20');
              if (colorBox) {
                 colorBox.style.backgroundColor = newHex;
                 colorBox.setAttribute('onclick', \`navigator.clipboard.writeText('\${newHex}'); notifyCopied('\${newHex}');\`);
                 const hexLabel = colorBox.querySelector('span');
                 if (hexLabel) hexLabel.textContent = newHex;
              }
           });
           window.notifyCopied('Source Tone Updated');
        }
      }
    });
`;
if (!content.includes('// Source Tone Ramp Click')) {
    content = content.replace('// Theme toggle', rampLogic + '\n    // Theme toggle');
}

// 5. Cross-Pair Contrast Ledger (Interactive Feature)
// Replace the hardcoded table with a dynamic interactive one.
const ledgerHtmlOldStart = `<!-- Responsive Table/Grid of Contrast Combinations -->`;
const ledgerHtmlOldEnd = `<!-- Right: Vision Simulator & Live Typography Gauge (4 cols) -->`;

const ledgerHtmlNew = `
<div class="overflow-x-auto mt-space-sm" id="contrast-ledger-container">
  <div class="flex gap-4 mb-4">
    <div class="flex flex-col gap-1">
      <label class="text-xs text-on-surface-variant">Foreground</label>
      <input type="color" id="fg-color" value="#06B6D4" class="w-16 h-8 rounded bg-surface-container border-none cursor-pointer">
    </div>
    <div class="flex flex-col gap-1">
      <label class="text-xs text-on-surface-variant">Background</label>
      <input type="color" id="bg-color" value="#0F172A" class="w-16 h-8 rounded bg-surface-container border-none cursor-pointer">
    </div>
    <div class="flex flex-col gap-1 justify-end">
       <button id="calc-contrast-btn" class="h-8 px-4 rounded bg-primary text-on-primary text-xs font-bold hover:bg-primary-fixed transition-colors">Calculate Score</button>
    </div>
    <div class="flex flex-col gap-1 justify-end ml-auto">
       <button id="improve-contrast-btn" class="h-8 px-4 rounded bg-tertiary text-on-primary text-xs font-bold hover:bg-tertiary-fixed transition-colors flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">auto_awesome</span> Suggest Better</button>
    </div>
  </div>
  <div id="contrast-result" class="p-4 rounded-xl bg-surface-container text-center mb-4 border border-white/10">
      <div class="font-mono text-3xl font-black text-on-surface tracking-tight" id="contrast-ratio-text">9.2:1</div>
      <div class="font-label-sm text-label-sm text-tertiary uppercase mt-1 font-bold" id="contrast-badge-text">AAA PASS</div>
      <div class="mt-4 p-3 rounded-lg flex items-center justify-center gap-4 text-lg" id="contrast-preview-box" style="background-color: #0F172A; color: #06B6D4;">
          <span class="font-bold">Large Text</span>
          <span class="font-normal text-sm">Regular Body Text</span>
      </div>
  </div>
</div>
`;

// String injection
let contentStart = content.substring(0, content.indexOf(ledgerHtmlOldStart));
let contentEnd = content.substring(content.indexOf(ledgerHtmlOldEnd));
content = contentStart + ledgerHtmlNew + contentEnd;

// Add Contrast logic to JS block
const contrastLogic = `
    function getLuminance(r, g, b) {
      let a = [r, g, b].map(function (v) {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow( (v + 0.055) / 1.055, 2.4 );
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    
    function hexToRgb(hex) {
      let r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    }
    
    function getContrast(hex1, hex2) {
      const rgb1 = hexToRgb(hex1);
      const rgb2 = hexToRgb(hex2);
      const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
      const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
      const brightest = Math.max(lum1, lum2);
      const darkest = Math.min(lum1, lum2);
      return (brightest + 0.05) / (darkest + 0.05);
    }
    
    document.addEventListener('click', (e) => {
      if (e.target.id === 'calc-contrast-btn' || e.target.closest('#calc-contrast-btn')) {
         const fg = document.getElementById('fg-color').value;
         const bg = document.getElementById('bg-color').value;
         const ratio = getContrast(fg, bg).toFixed(1);
         const ratioText = document.getElementById('contrast-ratio-text');
         const badgeText = document.getElementById('contrast-badge-text');
         const preview = document.getElementById('contrast-preview-box');
         
         ratioText.textContent = ratio + ':1';
         preview.style.backgroundColor = bg;
         preview.style.color = fg;
         
         if (ratio >= 7) {
            badgeText.textContent = 'AAA PASS';
            badgeText.className = 'font-label-sm text-label-sm text-tertiary uppercase mt-1 font-bold';
         } else if (ratio >= 4.5) {
            badgeText.textContent = 'AA PASS';
            badgeText.className = 'font-label-sm text-label-sm text-primary uppercase mt-1 font-bold';
         } else {
            badgeText.textContent = 'FAIL';
            badgeText.className = 'font-label-sm text-label-sm text-error uppercase mt-1 font-bold';
         }
      }
      
      if (e.target.id === 'improve-contrast-btn' || e.target.closest('#improve-contrast-btn')) {
         let fg = document.getElementById('fg-color').value;
         let bg = document.getElementById('bg-color').value;
         // Adjust fg lightness until contrast > 7
         let [h, s, l] = hexToHSL(fg);
         let steps = 0;
         while (getContrast(HSLToHex(h,s,l), bg) < 7 && steps < 50) {
            const bgLum = getLuminance(...hexToRgb(bg));
            if (bgLum > 0.5) l = Math.max(0, l - 2); // Darken fg if bg is light
            else l = Math.min(100, l + 2); // Lighten fg if bg is dark
            steps++;
         }
         const improvedHex = HSLToHex(h,s,l);
         document.getElementById('fg-color').value = improvedHex;
         document.getElementById('calc-contrast-btn').click();
         window.notifyCopied('Suggested improved color: ' + improvedHex);
      }
    });
`;

if (!content.includes('function getContrast')) {
    content = content.replace('// Theme toggle', contrastLogic + '\n    // Theme toggle');
}

// 6. Curated Color Systems Library - Add palettes and Click to apply
const presetsOldStart = `<!-- Presets Bento Mosaic -->`;
const presetsOldEnd = `<!-- SEO Footer -->`;

const newPresets = `
<!-- Presets Bento Mosaic -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg" id="preset-library-grid">
  <!-- Card 1: Dark Mode SaaS -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#090D16', '#1E293B', '#06B6D4', '#38BDF8', '#F8FAFC'], 'Dark Mode SaaS')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">Application UI</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">Dark Mode SaaS</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Dense developer workbenches.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#090D16]"></div><div class="h-full flex-1 bg-[#1E293B]"></div><div class="h-full flex-1 bg-[#06B6D4]"></div><div class="h-full flex-1 bg-[#38BDF8]"></div><div class="h-full flex-1 bg-[#F8FAFC]"></div>
      </div>
    </div>
  </div>
  
  <!-- Card 2: Cyber Neon -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#0A0A0A', '#111827', '#F43F5E', '#10B981', '#FCD34D'], 'Cyber Neon')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider">High Contrast</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-secondary transition-colors">Cyber Neon</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Vibrant warning states.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#0A0A0A]"></div><div class="h-full flex-1 bg-[#111827]"></div><div class="h-full flex-1 bg-[#F43F5E]"></div><div class="h-full flex-1 bg-[#10B981]"></div><div class="h-full flex-1 bg-[#FCD34D]"></div>
      </div>
    </div>
  </div>

  <!-- Card 3: Deep Forest -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#064E3B', '#047857', '#34D399', '#A7F3D0', '#ECFDF5'], 'Deep Forest')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold uppercase tracking-wider">Natural</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">Deep Forest</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Calming environmental interfaces.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#064E3B]"></div><div class="h-full flex-1 bg-[#047857]"></div><div class="h-full flex-1 bg-[#34D399]"></div><div class="h-full flex-1 bg-[#A7F3D0]"></div><div class="h-full flex-1 bg-[#ECFDF5]"></div>
      </div>
    </div>
  </div>
  
  <!-- Card 4: Sunset Minimal -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#FFF1F2', '#FECDD3', '#FDA4AF', '#FB7185', '#BE123C'], 'Sunset Minimal')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold uppercase tracking-wider">Minimalist</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">Sunset Minimal</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Warm monochromatic.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#FFF1F2]"></div><div class="h-full flex-1 bg-[#FECDD3]"></div><div class="h-full flex-1 bg-[#FDA4AF]"></div><div class="h-full flex-1 bg-[#FB7185]"></div><div class="h-full flex-1 bg-[#BE123C]"></div>
      </div>
    </div>
  </div>
  
  <!-- Card 5: Synthwave -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#2E1065', '#4C1D95', '#7C3AED', '#C084FC', '#F3E8FF'], 'Synthwave')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-label-sm text-label-sm font-semibold uppercase tracking-wider">High Contrast</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-secondary transition-colors">Synthwave</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Deep purples and pinks.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#2E1065]"></div><div class="h-full flex-1 bg-[#4C1D95]"></div><div class="h-full flex-1 bg-[#7C3AED]"></div><div class="h-full flex-1 bg-[#C084FC]"></div><div class="h-full flex-1 bg-[#F3E8FF]"></div>
      </div>
    </div>
  </div>

  <!-- Card 6: Ocean Depths -->
  <div class="bg-surface-container-low rounded-2xl p-space-md shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group cursor-pointer" onclick="window.applyPreset(['#083344', '#164E63', '#06B6D4', '#67E8F9', '#ECFEFF'], 'Ocean Depths')">
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold uppercase tracking-wider">Most Harmonious</span>
      </div>
      <div class="space-y-0.5">
        <h3 class="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-tertiary transition-colors">Ocean Depths</h3>
        <p class="font-body-sm text-body-sm text-on-surface-variant">Cool blue gradient tones.</p>
      </div>
      <div class="h-14 w-full rounded-xl overflow-hidden flex shadow-inner">
        <div class="h-full flex-1 bg-[#083344]"></div><div class="h-full flex-1 bg-[#164E63]"></div><div class="h-full flex-1 bg-[#06B6D4]"></div><div class="h-full flex-1 bg-[#67E8F9]"></div><div class="h-full flex-1 bg-[#ECFEFF]"></div>
      </div>
    </div>
  </div>
</div>
</div>
</section>
`;

contentStart = content.substring(0, content.indexOf(presetsOldStart));
contentEnd = content.substring(content.indexOf(presetsOldEnd));
content = contentStart + newPresets + contentEnd;

// Add Sorting Logic
const sortLogic = `
    document.addEventListener('change', (e) => {
      const select = e.target;
      if (select && select.parentElement && select.parentElement.textContent.includes('Sort:')) {
         const filter = select.value;
         const grid = document.getElementById('preset-library-grid');
         if (!grid) return;
         const cards = Array.from(grid.children);
         
         cards.sort((a, b) => {
            const tagA = a.querySelector('.uppercase').textContent;
            const tagB = b.querySelector('.uppercase').textContent;
            if (filter === 'Most Harmonious' && tagA === 'Most Harmonious') return -1;
            if (filter === 'High Contrast' && tagA === 'High Contrast') return -1;
            if (filter === 'Minimalist' && tagA === 'Minimalist') return -1;
            return 0;
         });
         
         grid.innerHTML = '';
         cards.forEach(c => grid.appendChild(c));
      }
    });
`;
if (!content.includes('const filter = select.value')) {
    content = content.replace('// Theme toggle', sortLogic + '\n    // Theme toggle');
}

fs.writeFileSync(filePath, content);
console.log('Successfully enhanced color palettes UI and logic!');
