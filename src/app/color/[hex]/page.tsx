"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

// --- Color Math Utilities ---
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(r, g, b) {
  return [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function hexToHSL(hex) {
  let [r, g, b] = hexToRgb(hex);
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
  return [h, +(s * 100).toFixed(1), +(l * 100).toFixed(1)];
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
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function hexToCmyk(hex) {
  let [r, g, b] = hexToRgb(hex);
  let c = 1 - (r / 255), m = 1 - (g / 255), y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round((c - k) / (1 - k) * 100),
    Math.round((m - k) / (1 - k) * 100),
    Math.round((y - k) / (1 - k) * 100),
    Math.round(k * 100)
  ];
}

function getLuminance(r, g, b) {
  let a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export default function ColorDetailPage() {
  const params = useParams();
  let hexParam = params?.hex || '0066FF';
  if (Array.isArray(hexParam)) hexParam = hexParam[0];
  const hex = hexParam.toUpperCase();
  const hexFull = '#' + hex;

  const [toast, setToast] = useState('');
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const copyHex = (h: string) => {
    navigator.clipboard.writeText(h);
    showToast(`Copied ${h} to clipboard!`);
  };

  // Math
  const rgb = hexToRgb(hex);
  const hsl = hexToHSL(hex);
  const cmyk = hexToCmyk(hex);
  
  const textColor = getLuminance(rgb[0], rgb[1], rgb[2]) > 0.179 ? '#000' : '#FFF';

  // Harmonies
  const harmonies = useMemo(() => {
    const [h, s, l] = hsl;
    return {
      Analogous: [HSLToHex((h + 330) % 360, s, l), hex, HSLToHex((h + 30) % 360, s, l)],
      Complementary: [hex, HSLToHex((h + 180) % 360, s, l)],
      Triadic: [hex, HSLToHex((h + 120) % 360, s, l), HSLToHex((h + 240) % 360, s, l)],
      Split: [hex, HSLToHex((h + 150) % 360, s, l), HSLToHex((h + 210) % 360, s, l)]
    };
  }, [hsl, hex]);

  // Shades & Tints
  const variations = useMemo(() => {
    const [h, s, l] = hsl;
    const shades = [];
    const tints = [];
    for (let i = 1; i <= 10; i++) shades.push(HSLToHex(h, s, Math.max(0, l - i * (l / 11))));
    for (let i = 1; i <= 10; i++) tints.push(HSLToHex(h, s, Math.min(100, l + i * ((100 - l) / 11))));
    return { shades, tints: tints.reverse() };
  }, [hsl]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-black text-xl tracking-tighter text-blue-600">CHROMA LAB</a>
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500">
             <a href="/tools/color-palettes" className="cursor-pointer hover:text-black transition-colors">Palettes</a>
             <a href="/tools/font-checker" className="cursor-pointer hover:text-black transition-colors">Fonts</a>
             <a href="/tools/gradient-builder" className="cursor-pointer hover:text-black transition-colors">Gradients</a>
             <a href="/tools/mesh-gradient-studio" className="cursor-pointer hover:text-black transition-colors">Mesh</a>
          </div>
        </div>
      </header>

      {/* Hero Swatch */}
      <section className="w-full h-80 flex flex-col items-center justify-center relative" style={{ backgroundColor: hexFull, color: textColor }}>
         <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider mb-2 drop-shadow-sm">{hexFull}</h1>
         <div className="text-xl font-bold opacity-80 mix-blend-overlay">Color Profile</div>
      </section>

      <main className="max-w-5xl mx-auto w-full px-6 py-16 space-y-16">
         {/* Conversions */}
         <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conversions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
               {[
                  { label: 'HEX', val: hexFull },
                  { label: 'RGB', val: `${rgb[0]}, ${rgb[1]}, ${rgb[2]}` },
                  { label: 'HSL', val: `${hsl[0]}°, ${hsl[1]}%, ${hsl[2]}%` },
                  { label: 'CMYK', val: `${cmyk[0]}%, ${cmyk[1]}%, ${cmyk[2]}%, ${cmyk[3]}%` },
               ].map((c, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors shadow-sm" onClick={() => copyHex(c.val)}>
                     <span className="text-gray-400 font-bold text-sm mb-1 uppercase tracking-widest">{c.label}</span>
                     <span className="text-gray-900 font-bold text-xl">{c.val}</span>
                  </div>
               ))}
            </div>
         </section>

         {/* Variations */}
         <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tints & Shades</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm">
               <div className="flex h-24 w-full">
                  {variations.tints.map((c, i) => (
                     <div key={`t-${i}`} className="flex-1 cursor-pointer hover:opacity-90" style={{ backgroundColor: '#' + c }} onClick={() => copyHex('#' + c)} title={`#${c}`}></div>
                  ))}
                  <div className="flex-1 cursor-pointer ring-4 ring-black/10 z-10" style={{ backgroundColor: hexFull }} onClick={() => copyHex(hexFull)} title={hexFull}></div>
                  {variations.shades.map((c, i) => (
                     <div key={`s-${i}`} className="flex-1 cursor-pointer hover:opacity-90" style={{ backgroundColor: '#' + c }} onClick={() => copyHex('#' + c)} title={`#${c}`}></div>
                  ))}
               </div>
               <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between text-xs font-bold text-gray-500 uppercase">
                  <span>Lighter</span>
                  <span>Base</span>
                  <span>Darker</span>
               </div>
            </div>
         </section>

         {/* Harmonies */}
         <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Color Harmonies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {Object.entries(harmonies).map(([name, colors]) => (
                  <div key={name} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                     <h3 className="text-lg font-bold text-gray-800 mb-4">{name}</h3>
                     <div className="flex h-20 rounded-lg overflow-hidden shadow-inner cursor-pointer" onClick={() => copyHex(colors.join(', '))}>
                        {colors.map((c, i) => (
                           <div key={i} className="flex-1 flex items-end justify-center pb-2" style={{ backgroundColor: c.includes('#') ? c : '#' + c }}>
                              <span className="text-[10px] font-bold opacity-60 mix-blend-difference text-white">{c.includes('#') ? c : '#' + c}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </section>
      </main>
      
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-50 animate-fade-in-up flex items-center gap-2">
           <span className="material-symbols-outlined text-green-400">check_circle</span>
           {toast}
        </div>
      )}
    </div>
  );
}
