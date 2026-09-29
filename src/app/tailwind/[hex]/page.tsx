"use client";

import React, { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

function hexToRgb(hex) {
  hex = hex.replace('#', '');
  let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
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

export default function TailwindPalettePage() {
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

  const copyText = (txt: string, msg: string) => {
    navigator.clipboard.writeText(txt);
    showToast(msg);
  };

  const scale = useMemo(() => {
    const [h, s] = hexToHSL(hexFull);
    // Tailwind's typical luminance targets for 50-950
    const stops = [
      { step: 50, l: 96 },
      { step: 100, l: 90 },
      { step: 200, l: 80 },
      { step: 300, l: 70 },
      { step: 400, l: 60 },
      { step: 500, l: 50 },
      { step: 600, l: 40 },
      { step: 700, l: 30 },
      { step: 800, l: 20 },
      { step: 900, l: 15 },
      { step: 950, l: 10 },
    ];
    return stops.map(stop => ({
      step: stop.step,
      hex: HSLToHex(h, s, stop.l)
    }));
  }, [hexFull]);

  const tailwindConfigCode = `module.exports = {
  theme: {
    extend: {
      colors: {
        'brand': {
${scale.map(s => `          ${s.step}: '${s.hex}',`).join('\n')}
        },
      }
    }
  }
}`;

  const cssVarsCode = `:root {
${scale.map(s => `  --color-brand-${s.step}: ${s.hex};`).join('\n')}
}`;

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

      <main className="max-w-5xl mx-auto w-full px-6 py-16 space-y-12">
         {/* Header */}
         <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-3xl mx-auto shadow-xl ring-4 ring-white" style={{ backgroundColor: hexFull }}></div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Tailwind Palette for {hexFull}</h1>
            <p className="text-lg text-gray-500 font-medium">Instantly generate a highly-calibrated 11-step scale for your Tailwind CSS project.</p>
         </div>

         {/* Visual Scale */}
         <section className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-11 gap-2 h-32 md:h-64">
               {scale.map((s, idx) => {
                  const textColor = getLuminance(...hexToRgb(s.hex)) > 0.179 ? '#000' : '#FFF';
                  return (
                     <div 
                        key={idx} 
                        className="rounded-xl flex flex-col justify-between p-3 cursor-pointer hover:-translate-y-1 transition-transform shadow-sm"
                        style={{ backgroundColor: s.hex, color: textColor }}
                        onClick={() => copyText(s.hex, `Copied ${s.hex}!`)}
                     >
                        <span className="text-xs font-bold opacity-60">{s.step}</span>
                        <span className="text-sm font-bold -rotate-90 origin-bottom-left absolute bottom-4 left-5 opacity-90 hidden md:block">{s.hex}</span>
                        <span className="text-sm font-bold md:hidden">{s.hex}</span>
                     </div>
                  );
               })}
            </div>
         </section>

         {/* Code Export */}
         <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-xl relative group">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold">tailwind.config.js</h3>
                  <button 
                     onClick={() => copyText(tailwindConfigCode, 'Copied config!')}
                     className="text-gray-400 hover:text-white transition-colors"
                  >
                     <span className="material-symbols-outlined">content_copy</span>
                  </button>
               </div>
               <pre className="text-sm text-blue-300 font-mono overflow-x-auto whitespace-pre">
                  {tailwindConfigCode}
               </pre>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative group">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-gray-900 font-bold">CSS Variables</h3>
                  <button 
                     onClick={() => copyText(cssVarsCode, 'Copied CSS!')}
                     className="text-gray-400 hover:text-gray-900 transition-colors"
                  >
                     <span className="material-symbols-outlined">content_copy</span>
                  </button>
               </div>
               <pre className="text-sm text-gray-600 font-mono overflow-x-auto whitespace-pre">
                  {cssVarsCode}
               </pre>
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
