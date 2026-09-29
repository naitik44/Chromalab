"use client";

import React, { useState, useEffect, useMemo } from 'react';

const TOP_FONTS = [
  { name: 'Inter', category: 'Sans Serif', author: 'Rasmus Andersson' },
  { name: 'Roboto', category: 'Sans Serif', author: 'Christian Robertson' },
  { name: 'Open Sans', category: 'Sans Serif', author: 'Steve Matteson' },
  { name: 'Montserrat', category: 'Sans Serif', author: 'Julieta Ulanovsky' },
  { name: 'Lato', category: 'Sans Serif', author: 'Łukasz Dziedzic' },
  { name: 'Poppins', category: 'Sans Serif', author: 'Indian Type Foundry' },
  { name: 'Oswald', category: 'Sans Serif', author: 'Vernon Adams' },
  { name: 'Raleway', category: 'Sans Serif', author: 'Multiple Designers' },
  { name: 'Ubuntu', category: 'Sans Serif', author: 'Dalton Maag' },
  { name: 'Nunito', category: 'Sans Serif', author: 'Vernon Adams' },
  { name: 'Playfair Display', category: 'Serif', author: 'Claus Eggers Sørensen' },
  { name: 'Merriweather', category: 'Serif', author: 'Sorkin Type' },
  { name: 'Lora', category: 'Serif', author: 'Cyreal' },
  { name: 'PT Serif', category: 'Serif', author: 'ParaType' },
  { name: 'Roboto Slab', category: 'Serif', author: 'Christian Robertson' },
  { name: 'Libre Baskerville', category: 'Serif', author: 'Impallari Type' },
  { name: 'Fira Sans', category: 'Sans Serif', author: 'Carrois Apostrophe' },
  { name: 'Work Sans', category: 'Sans Serif', author: 'Wei Huang' },
  { name: 'Quicksand', category: 'Sans Serif', author: 'Andrew Paglinawan' },
  { name: 'Rubik', category: 'Sans Serif', author: 'Hubert and Fischer' },
  { name: 'Inconsolata', category: 'Monospace', author: 'Raph Levien' },
  { name: 'Source Code Pro', category: 'Monospace', author: 'Paul D. Hunt' },
  { name: 'Fira Code', category: 'Monospace', author: 'The Fira Code Project' },
  { name: 'Space Mono', category: 'Monospace', author: 'Colophon Foundry' },
  { name: 'Dancing Script', category: 'Handwriting', author: 'Impallari Type' },
  { name: 'Pacifico', category: 'Handwriting', author: 'Vernon Adams' },
  { name: 'Caveat', category: 'Handwriting', author: 'Impallari Type' },
  { name: 'Righteous', category: 'Display', author: 'Astigmatic' },
  { name: 'Bebas Neue', category: 'Display', author: 'Ryoichi Tsunekawa' },
  { name: 'Abril Fatface', category: 'Display', author: 'TypeTogether' }
];

// Helper to generate the Google Fonts URL for all the fonts we support
const generateGoogleFontsUrl = () => {
  const families = TOP_FONTS.map(f => `family=${f.name.replace(/ /g, '+')}:wght@400;600;700`).join('&');
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
};

export default function FontChecker() {
  const [search, setSearch] = useState('');
  const [previewText, setPreviewText] = useState('Grumpy wizards make toxic brew for the evil Queen and Jack.');
  const [category, setCategory] = useState('All Categories');
  const [fontSize, setFontSize] = useState(32);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filteredFonts = useMemo(() => {
    return TOP_FONTS.filter(font => {
      const matchesSearch = font.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === 'All Categories' || font.category === category;
      return matchesSearch && matchesCat;
    });
  }, [search, category]);

  const copyFontName = (name: string) => {
    navigator.clipboard.writeText(name);
    showToast(`Copied "${name}" to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <link href={generateGoogleFontsUrl()} rel="stylesheet" />
      
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/" className="font-black text-xl tracking-tighter text-blue-600">CHROMA LAB</a>
          <div className="hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500">
             <a href="/tools/color-palettes" className="cursor-pointer hover:text-black transition-colors">Palettes</a>
             <a href="/tools/font-checker" className="cursor-pointer text-black transition-colors">Fonts</a>
             <a href="/tools/gradient-builder" className="cursor-pointer hover:text-black transition-colors">Gradients</a>
             <a href="/tools/mesh-gradient-studio" className="cursor-pointer hover:text-black transition-colors">Mesh</a>
          </div>
        </div>
      </header>

      {/* Font Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 px-6 py-4 flex flex-wrap items-center gap-4 shadow-sm">
         <div className="flex-1 min-w-[200px] flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
            <span className="material-symbols-outlined text-gray-400">search</span>
            <input 
               type="text" 
               placeholder="Search fonts..." 
               className="w-full outline-none text-gray-700 bg-transparent font-medium"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         
         <div className="flex-1 min-w-[300px] flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-blue-500 transition-colors">
            <span className="material-symbols-outlined text-gray-400">text_fields</span>
            <input 
               type="text" 
               placeholder="Type something to preview..." 
               className="w-full outline-none text-gray-700 bg-transparent font-medium"
               value={previewText}
               onChange={(e) => setPreviewText(e.target.value)}
            />
         </div>
         
         <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 text-gray-700 font-semibold px-4 py-2.5 rounded-lg outline-none hover:bg-gray-50 cursor-pointer"
         >
            <option>All Categories</option>
            <option>Sans Serif</option>
            <option>Serif</option>
            <option>Display</option>
            <option>Handwriting</option>
            <option>Monospace</option>
         </select>
         
         <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5">
            <span className="text-xs font-bold text-gray-500 uppercase">Size</span>
            <input 
               type="range" 
               min="12" max="120" 
               value={fontSize} 
               onChange={(e) => setFontSize(parseInt(e.target.value))}
               className="w-24 cursor-pointer accent-blue-600"
            />
            <span className="text-sm font-semibold text-gray-700 w-8 text-right">{fontSize}px</span>
         </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-[1600px] mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         {filteredFonts.map((font, idx) => (
            <div 
               key={idx} 
               className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col group cursor-pointer"
               onClick={() => copyFontName(font.name)}
            >
               {/* Font Meta */}
               <div className="flex items-center justify-between mb-6">
                  <div>
                     <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{font.name}</h3>
                     <p className="text-sm font-medium text-gray-500">{font.author}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600" title="Copy Name">
                        <span className="material-symbols-outlined text-xl">content_copy</span>
                     </button>
                     <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600" title="Add to Favorites">
                        <span className="material-symbols-outlined text-xl">favorite</span>
                     </button>
                  </div>
               </div>
               
               {/* Font Preview Area */}
               <div className="flex-1 flex items-center overflow-hidden">
                  <div 
                     style={{ 
                        fontFamily: `'${font.name}', sans-serif`, 
                        fontSize: `${fontSize}px`
                     }}
                     className="text-gray-900 leading-tight break-words max-h-48 overflow-hidden"
                  >
                     {previewText || font.name}
                  </div>
               </div>
               
               {/* Footer */}
               <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                     {font.category}
                  </span>
                  <div className="flex gap-2">
                     <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">A</span>
                     <span className="text-xs font-semibold text-gray-400">Variable</span>
                  </div>
               </div>
            </div>
         ))}
         
         {filteredFonts.length === 0 && (
            <div className="col-span-full py-24 text-center">
               <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
               <h2 className="text-2xl font-bold text-gray-900 mb-2">No fonts found</h2>
               <p className="text-gray-500 font-medium">Try adjusting your search or filters.</p>
            </div>
         )}
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
