"use client";

import React, { useState, useEffect, useCallback } from 'react';

// --- Utilities ---
const getRandomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();

function hexToHSL(H) {
  let r = 0, g = 0, b = 0;
  if (H.length === 7) {
    r = parseInt(H.substring(1, 3), 16);
    g = parseInt(H.substring(3, 5), 16);
    b = parseInt(H.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin, h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return [h, s, l];
}

function HSLToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs((h / 60) % 2 - 1)),
      m = l - c / 2, r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`.toUpperCase();
}

function getLuminance(r, g, b) {
  let a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
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
  if(!hex1 || !hex2 || hex1.length !== 7 || hex2.length !== 7) return 1;
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getContrastColor(hex) {
  // Returns black or white depending on background
  const rgb = hexToRgb(hex);
  const lum = getLuminance(rgb[0], rgb[1], rgb[2]);
  return lum > 0.179 ? '#000000' : '#FFFFFF';
}

const PRESETS = [
  { name: 'Dark Mode SaaS', colors: ['#090D16', '#1E293B', '#06B6D4', '#38BDF8', '#F8FAFC'], tags: ['Application UI'] },
  { name: 'Cyber Neon', colors: ['#0A0A0A', '#111827', '#F43F5E', '#10B981', '#FCD34D'], tags: ['High Contrast'] },
  { name: 'Deep Forest', colors: ['#064E3B', '#047857', '#34D399', '#A7F3D0', '#ECFDF5'], tags: ['Natural'] },
  { name: 'Sunset Minimal', colors: ['#FFF1F2', '#FECDD3', '#FDA4AF', '#FB7185', '#BE123C'], tags: ['Minimalist'] },
  { name: 'Synthwave', colors: ['#2E1065', '#4C1D95', '#7C3AED', '#C084FC', '#F3E8FF'], tags: ['High Contrast'] },
  { name: 'Ocean Depths', colors: ['#083344', '#164E63', '#06B6D4', '#67E8F9', '#ECFEFF'], tags: ['Most Harmonious'] },
  { name: 'Autumn Spice', colors: ['#451A03', '#78350F', '#D97706', '#F59E0B', '#FEF3C7'], tags: ['Warm'] },
  { name: 'Lavender Dream', colors: ['#FAFAFA', '#F3E8FF', '#D8B4FE', '#A855F7', '#7E22CE'], tags: ['Minimalist'] },
  { name: 'Retro 80s', colors: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0', '#2EC4B6'], tags: ['Retro'] },
  { name: 'Mint Chocolate', colors: ['#1A1A1A', '#333333', '#A3E4D7', '#76D7C4', '#48C9B0'], tags: ['High Contrast'] },
  { name: 'Berry Blast', colors: ['#4A235A', '#6C3483', '#BB8FCE', '#D7BDE2', '#F5EEF8'], tags: ['Monochromatic'] },
  { name: 'Desert Sand', colors: ['#EAE2B7', '#FCBF49', '#F77F00', '#D62828', '#003049'], tags: ['Vibrant'] },
  { name: 'Pastel Sunrise', colors: ['#FFB5A7', '#FCD5CE', '#F8EDEB', '#F9DCC4', '#FEC89A'], tags: ['Minimalist'] },
  { name: 'Midnight City', colors: ['#000000', '#14213D', '#FCA311', '#E5E5E5', '#FFFFFF'], tags: ['High Contrast'] },
  { name: 'Matcha Latte', colors: ['#DDE5B6', '#ADC178', '#A98467', '#6C584C', '#F0EAD2'], tags: ['Natural'] },
  { name: 'Coral Reef', colors: ['#03045E', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'], tags: ['Oceanic'] },
  { name: 'Vintage Polar', colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'], tags: ['Retro'] },
  { name: 'Arctic Ice', colors: ['#EDF2F4', '#8D99AE', '#2B2D42', '#EF233C', '#D90429'], tags: ['Application UI'] }
];

export default function ColorPalettes() {
  const [palettes, setPalettes] = useState([
    { hex: '#112A46', locked: false, name: 'Space Cadet' },
    { hex: '#ACC8E5', locked: false, name: 'Uranian Blue' },
    { hex: '#D946EF', locked: false, name: 'Fuchsia' },
    { hex: '#0F172A', locked: false, name: 'Slate' },
    { hex: '#10B981', locked: false, name: 'Emerald' }
  ]);
  
  const [harmony, setHarmony] = useState('random');
  const [toast, setToast] = useState('');
  
  // Contrast Ledger State
  const [fgColor, setFgColor] = useState('#112A46');
  const [bgColor, setBgColor] = useState('#ACC8E5');
  
  // Luminance State
  const [lumSource, setLumSource] = useState('#06B6D4');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    showToast(`Copied ${hex} to clipboard!`);
  };

  const toggleLock = (index) => {
    setPalettes(prev => {
      const next = [...prev];
      next[index].locked = !next[index].locked;
      return next;
    });
  };
  
  const setPaletteHex = (index, hex) => {
    setPalettes(prev => {
      const next = [...prev];
      next[index].hex = hex.toUpperCase();
      return next;
    });
  };

  const generatePalettes = useCallback(() => {
    setPalettes(prev => {
      const next = [...prev];
      let baseHsl = null;
      
      const lockedIdx = next.findIndex(p => p.locked);
      if (lockedIdx !== -1) {
        baseHsl = hexToHSL(next[lockedIdx].hex);
      } else {
        baseHsl = hexToHSL(getRandomHex());
      }
      
      let [h, s, l] = baseHsl;
      
      return next.map((p, idx) => {
        if (p.locked) return p;
        if (harmony === 'random') return { ...p, hex: getRandomHex() };
        
        let newH = h, newS = s, newL = l;
        if (harmony === 'analogous') newH = (h + (idx * 30)) % 360;
        else if (harmony === 'complementary') newH = (h + (idx % 2 === 0 ? 0 : 180)) % 360;
        else if (harmony === 'triadic') newH = (h + (idx * 120)) % 360;
        else if (harmony === 'tetradic') newH = (h + (idx * 90)) % 360;
        else if (harmony === 'split') newH = (h + (idx === 0 ? 0 : (idx % 2 === 0 ? 150 : 210))) % 360;
        else if (harmony === 'monochromatic') newL = Math.max(10, Math.min(90, l + (idx * 15 - 30)));
        
        return { ...p, hex: HSLToHex(newH, newS, newL) };
      });
    });
  }, [harmony]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        generatePalettes();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generatePalettes]);

  const suggestBetterContrast = () => {
     let [h, s, l] = hexToHSL(fgColor);
     let steps = 0;
     while (getContrast(HSLToHex(h,s,l), bgColor) < 7 && steps < 50) {
        const bgLum = getLuminance(...hexToRgb(bgColor));
        if (bgLum > 0.5) l = Math.max(0, l - 2);
        else l = Math.min(100, l + 2);
        steps++;
     }
     const improvedHex = HSLToHex(h,s,l);
     setFgColor(improvedHex);
     showToast('Suggested improved color: ' + improvedHex);
  };
  
  const applyPreset = (presetColors) => {
     setPalettes(prev => prev.map((p, i) => ({ ...p, hex: presetColors[i] || p.hex, locked: false })));
     window.scrollTo({ top: 0, behavior: 'smooth' });
     showToast('Palette applied');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header - Minimal Coolors Style */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-black text-xl tracking-tighter text-blue-600">CHROMA LAB</a>
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500">
             <a href="/tools/color-palettes" className="cursor-pointer text-black transition-colors">Palettes</a>
             <a href="/tools/font-checker" className="cursor-pointer hover:text-black transition-colors">Fonts</a>
             <a href="/tools/gradient-builder" className="cursor-pointer hover:text-black transition-colors">Gradients</a>
             <a href="/tools/mesh-gradient-studio" className="cursor-pointer hover:text-black transition-colors">Mesh</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select 
             value={harmony} 
             onChange={(e) => setHarmony(e.target.value)}
             className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border-none cursor-pointer outline-none hover:bg-gray-200 transition-colors"
          >
             <option value="random">Random</option>
             <option value="analogous">Analogous</option>
             <option value="complementary">Complementary</option>
             <option value="triadic">Triadic</option>
             <option value="tetradic">Tetradic</option>
             <option value="split">Split-Complementary</option>
             <option value="monochromatic">Monochromatic</option>
          </select>
          <button 
             onClick={generatePalettes}
             className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors hidden sm:block"
          >
             Generate (Space)
          </button>
        </div>
      </header>

      {/* Main Fullscreen Palette (Coolors style) */}
      <section className="flex-1 w-full flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {palettes.map((p, idx) => {
           const textColor = getContrastColor(p.hex);
           return (
             <div 
               key={idx} 
               className="flex-1 flex flex-col relative group transition-all duration-300 min-h-[100px]"
               style={{ backgroundColor: p.hex }}
             >
               {/* Hover Actions (Center) */}
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 gap-4">
                  <button onClick={() => toggleLock(idx)} className="p-2 rounded-full hover:bg-black/10 transition-colors" style={{ color: textColor }}>
                     <span className="material-symbols-outlined text-3xl">{p.locked ? 'lock' : 'lock_open'}</span>
                  </button>
                  <button onClick={() => copyHex(p.hex)} className="p-2 rounded-full hover:bg-black/10 transition-colors" style={{ color: textColor }}>
                     <span className="material-symbols-outlined text-3xl">content_copy</span>
                  </button>
               </div>
               
               {/* HEX Info (Bottom) */}
               <div className="mt-auto pb-8 flex flex-col items-center justify-end w-full" style={{ color: textColor }}>
                  <input 
                     type="text" 
                     value={p.hex.replace('#', '')}
                     onChange={(e) => {
                        const val = e.target.value;
                        setPaletteHex(idx, '#' + val);
                     }}
                     className="bg-transparent text-center font-bold text-2xl uppercase tracking-wider w-32 outline-none"
                  />
                  <div className="text-sm font-semibold opacity-70 mt-1">{p.name}</div>
               </div>
             </div>
           );
        })}
      </section>
      
      <div className="max-w-7xl mx-auto w-full px-4 py-16 space-y-16">
         {/* Contrast Checker (Coolors style) */}
         <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Contrast Checker</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Text Color</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 focus-within:border-blue-500">
                           <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
                           <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-full uppercase font-bold text-gray-700 outline-none" />
                        </div>
                     </div>
                     <div className="flex-1">
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">Background Color</label>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 focus-within:border-blue-500">
                           <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer border-none p-0" />
                           <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full uppercase font-bold text-gray-700 outline-none" />
                        </div>
                     </div>
                  </div>
                  <button onClick={suggestBetterContrast} className="w-full bg-indigo-50 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                     <span className="material-symbols-outlined">auto_awesome</span> Suggest Better Text Color
                  </button>
               </div>
               
               <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6" style={{ backgroundColor: bgColor, color: fgColor }}>
                  <div className="text-5xl font-black tracking-tight mb-2">{getContrast(fgColor, bgColor).toFixed(1)}</div>
                  <div className="text-xl font-bold uppercase tracking-widest opacity-90">
                     {getContrast(fgColor, bgColor) >= 7 ? 'AAA Very Good' : getContrast(fgColor, bgColor) >= 4.5 ? 'AA Good' : 'Poor'}
                  </div>
                  <div className="mt-8 text-center">
                     <div className="text-2xl font-bold">Large Text Example</div>
                     <div className="text-base font-normal mt-2 max-w-sm">This is a regular paragraph text example to demonstrate readability on this background.</div>
                  </div>
               </div>
            </div>
         </section>
         
         {/* Luminance Scale */}
         <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold text-gray-900">Tonal Palette Scale</h2>
               <div className="flex gap-2">
                  {['#06B6D4', '#6366F1', '#D946EF', '#10B981'].map(c => (
                     <button key={c} onClick={() => setLumSource(c)} className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-2 ring-transparent hover:ring-gray-300" style={{ backgroundColor: c }} />
                  ))}
               </div>
            </div>
            
            <div className="flex w-full h-32 rounded-xl overflow-hidden shadow-inner">
               {[96, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((l, i) => {
                  const [h, s] = hexToHSL(lumSource);
                  const hex = HSLToHex(h, s, l);
                  return (
                     <div key={i} className="flex-1 flex flex-col items-center justify-end pb-3 hover:flex-[1.5] transition-all cursor-pointer group" style={{ backgroundColor: hex }} onClick={() => copyHex(hex)}>
                        <div className="opacity-0 group-hover:opacity-100 font-mono text-xs font-bold transition-opacity" style={{ color: getContrastColor(hex) }}>{hex}</div>
                     </div>
                  );
               })}
            </div>
         </section>
         
         {/* Curated Palettes */}
         <section>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">Trending Palettes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {PRESETS.map((preset, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => applyPreset(preset.colors)}>
                     <div className="flex h-24 rounded-xl overflow-hidden mb-4">
                        {preset.colors.map((c, j) => (
                           <div key={j} className="flex-1" style={{ backgroundColor: c }}></div>
                        ))}
                     </div>
                     <div className="flex justify-between items-center px-1">
                        <div className="font-bold text-gray-800">{preset.name}</div>
                        <div className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">{preset.tags[0]}</div>
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </div>

      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-fade-in-up flex items-center gap-2">
           <span className="material-symbols-outlined text-green-400">check_circle</span>
           {toast}
        </div>
      )}
    </div>
  );
}
