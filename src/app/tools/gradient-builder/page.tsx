"use client";
import React, { useState, useRef, useEffect } from 'react';

type Stop = { id: string; color: string; pos: number };

export default function GradientBuilder() {
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', color: '#06b6d4', pos: 0 },
    { id: '2', color: '#3b82f6', pos: 34 },
    { id: '3', color: '#8b5cf6', pos: 68 },
    { id: '4', color: '#ec4899', pos: 100 }
  ]);
  const [mode, setMode] = useState('linear'); // linear, radial, conic, mesh, aurora
  const [angle, setAngle] = useState(135);
  const [activeTab, setActiveTab] = useState('css');
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!draggingId || !trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      let pos = ((e.clientX - rect.left) / rect.width) * 100;
      pos = Math.max(0, Math.min(100, pos));
      setStops(current => {
        const next = current.map(s => s.id === draggingId ? { ...s, pos: Math.round(pos) } : s);
        return next;
      });
    };
    const handlePointerUp = () => setDraggingId(null);
    
    if (draggingId) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
  }, [draggingId]);

  const handleTrackClick = (e: React.MouseEvent) => {
    if (draggingId || (e.target as HTMLElement).closest('.stop-pin')) return;
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let pos = ((e.clientX - rect.left) / rect.width) * 100;
    pos = Math.round(Math.max(0, Math.min(100, pos)));
    const newStop = { id: Date.now().toString(), color: '#ffffff', pos };
    setStops(current => [...current, newStop].sort((a, b) => a.pos - b.pos));
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return; // need at least 2 stops
    setStops(current => current.filter(s => s.id !== id));
  };

  const updateStop = (id: string, updates: Partial<Stop>) => {
    setStops(current => current.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const stopsStr = [...stops].sort((a, b) => a.pos - b.pos).map(s => `${s.color} ${s.pos}%`).join(', ');
  
  const getGradientStyle = () => {
    if (mode === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`;
    if (mode === 'radial') return `radial-gradient(circle at center, ${stopsStr})`;
    if (mode === 'conic') return `conic-gradient(from ${angle}deg at 50% 50%, ${stopsStr})`;
    if (mode === 'mesh') return `radial-gradient(at 0% 0%, ${stops[0]?.color} 0px, transparent 50%), radial-gradient(at 100% 0%, ${stops[1]?.color || 'transparent'} 0px, transparent 50%), radial-gradient(at 100% 100%, ${stops[2]?.color || 'transparent'} 0px, transparent 50%), radial-gradient(at 0% 100%, ${stops[3]?.color || 'transparent'} 0px, transparent 50%), #0b1326`;
    if (mode === 'aurora') return `linear-gradient(${angle}deg, ${stopsStr}), radial-gradient(circle at 80% 20%, rgba(78, 222, 163, 0.4) 0%, transparent 60%)`;
    return `linear-gradient(${angle}deg, ${stopsStr})`;
  };

  const gradientStyle = getGradientStyle();

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-on-surface">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
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

      <main className="w-full pt-16 flex-1 flex flex-col items-center">
        <div className="w-full px-gutter py-space-lg flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg border-b border-outline-variant/20 bg-surface-container-lowest/60 backdrop-blur-md">
          <div className="flex flex-col gap-space-xs max-w-3xl">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">Interactive Multi-Format Gradient Engine</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Synthesize ultra-smooth multi-stop linear, radial, conic, and 4-corner mesh gradients with perceptual color interpolation. Add, drag, or remove stops easily.
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap shrink-0">
            <button onClick={() => setStops([...stops].reverse().map(s => ({ ...s, pos: 100 - s.pos })))} className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-all shadow-sm">
              <span className="material-symbols-outlined text-body-lg text-secondary">swap_horiz</span>
              <span className="font-label-lg text-label-lg">Invert Stops</span>
            </button>
            <button onClick={() => navigator.clipboard.writeText(`background: ${gradientStyle};`)} className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-primary transition-all">
              <span className="material-symbols-outlined text-body-lg">content_copy</span>
              <span>Copy CSS</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1600px] px-gutter py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-lg mx-auto">
          {/* Left Area: Canvas */}
          <div className="lg:col-span-8 flex flex-col gap-space-md">
            <div className="w-full flex flex-wrap items-center justify-between gap-space-sm p-space-sm bg-surface-container-lowest/80 rounded-xl border border-outline-variant/20 backdrop-blur-md">
              <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg">
                {['linear', 'radial', 'conic', 'mesh', 'aurora'].map(m => (
                  <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded font-label-md text-label-md flex items-center gap-1.5 transition-all capitalize ${mode === m ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="relative w-full h-[480px] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center bg-surface-container-lowest">
              <div className="absolute inset-0 w-full h-full transition-all duration-150" style={{ background: gradientStyle }}></div>
            </div>

            {/* Timeline */}
            <div className="w-full bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex flex-col gap-space-md mt-4">
              <div className="flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface">Gradient Timeline</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Click track to add, drag to move</span>
              </div>
              <div className="relative w-full h-12 flex items-center select-none pt-4 pb-2" ref={trackRef} onClick={handleTrackClick}>
                <div className="w-full h-4 rounded-full relative shadow-inner cursor-pointer" style={{ background: `linear-gradient(90deg, ${stopsStr})` }}>
                  {stops.map(stop => (
                    <div 
                      key={stop.id}
                      className="stop-pin absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing group"
                      style={{ left: `${stop.pos}%`, zIndex: draggingId === stop.id ? 10 : 1 }}
                      onPointerDown={(e) => { e.stopPropagation(); setDraggingId(stop.id); }}
                    >
                      <div className="w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-125" style={{ backgroundColor: stop.color }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest"></div>
                      </div>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] font-mono text-on-surface opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        {stop.pos}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm pt-2">
                {stops.map((stop, idx) => (
                  <div key={stop.id} className="flex items-center justify-between p-space-sm rounded-lg bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-space-xs">
                      <input type="color" value={stop.color} onChange={e => updateStop(stop.id, { color: e.target.value })} className="w-7 h-7 rounded border-0 cursor-pointer bg-transparent" />
                      <div className="flex flex-col">
                        <span className="font-mono text-label-sm text-on-surface uppercase">{stop.color}</span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">Stop {idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        <input type="number" value={stop.pos} onChange={e => updateStop(stop.id, { pos: Number(e.target.value) })} className="w-12 bg-transparent text-right font-mono text-label-sm text-on-surface focus:outline-none" />
                        <span className="font-mono text-label-sm text-on-surface-variant">%</span>
                      </div>
                      <button onClick={() => removeStop(stop.id)} className="text-[10px] text-error hover:underline disabled:opacity-50" disabled={stops.length <= 2}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Area: Controls */}
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20">
              <h3 className="font-headline-sm mb-4">Properties</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="font-label-md">Rotation Angle</label>
                  <span className="font-mono text-primary">{angle}°</span>
                </div>
                <input type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-primary" />
              </div>
            </div>

            <div className="bg-surface-container-low rounded-xl p-space-md border border-outline-variant/20 flex-1">
              <div className="flex gap-2 mb-4">
                <button onClick={() => setActiveTab('css')} className={`px-4 py-2 rounded-lg font-label-md ${activeTab === 'css' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}>CSS</button>
                <button onClick={() => setActiveTab('tailwind')} className={`px-4 py-2 rounded-lg font-label-md ${activeTab === 'tailwind' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}>Tailwind</button>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-lg font-mono text-body-sm overflow-x-auto">
                {activeTab === 'css' && (
                  <div>
                    <span className="text-primary">background</span>: <span className="text-secondary">{gradientStyle}</span>;
                  </div>
                )}
                {activeTab === 'tailwind' && (
                  <div className="whitespace-normal">
                    <span className="text-secondary">bg-gradient-to-br</span>
                    {stops.map(s => ` from-[${s.color}] via-[${s.color}]`).join(' ')}
                    <br/><span className="text-outline-variant block mt-2">/* Tailwind arbitrary stops require exact percentages via custom classes, CSS is recommended */</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
