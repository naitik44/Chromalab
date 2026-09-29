"use client";
import React, { useState, useRef, useEffect } from 'react';
import { NeatGradient } from "@firecms/neat";
import { neatPresets } from './presets';

type NeatColor = { color: string; enabled: boolean };

export default function MeshGradientStudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  // neat gradient configuration state
  const [currentPreset, setCurrentPreset] = useState<any>(neatPresets[0]);
  const [colors, setColors] = useState<NeatColor[]>(neatPresets[0].colors.map((c:any) => ({color: c.color, enabled: c.enabled})));
  
  const [speed, setSpeed] = useState(neatPresets[0].speed || 4);
  const [waveAmplitude, setWaveAmplitude] = useState(neatPresets[0].waveAmplitude || 3);
  const [grainIntensity, setGrainIntensity] = useState(neatPresets[0].grainIntensity || 0.55);
  const [colorBlending, setColorBlending] = useState(neatPresets[0].colorBlending || 5);
  const [shadows, setShadows] = useState(neatPresets[0].shadows || 4);
  const [highlights, setHighlights] = useState(neatPresets[0].highlights || 4);
  const [wireframe, setWireframe] = useState(neatPresets[0].wireframe || false);

  const loadPreset = (preset: any) => {
    setCurrentPreset(preset);
    const nextColors = preset.colors.map((c: any) => ({
      color: c.color,
      enabled: c.enabled
    }));
    while (nextColors.length < 6) {
      nextColors.push({ color: '#000000', enabled: false });
    }
    setColors(nextColors);
    
    if (preset.speed !== undefined) setSpeed(preset.speed);
    if (preset.waveAmplitude !== undefined) setWaveAmplitude(preset.waveAmplitude);
    if (preset.grainIntensity !== undefined) setGrainIntensity(preset.grainIntensity);
    if (preset.colorBlending !== undefined) setColorBlending(preset.colorBlending);
    if (preset.shadows !== undefined) setShadows(preset.shadows);
    if (preset.highlights !== undefined) setHighlights(preset.highlights);
    if (preset.wireframe !== undefined) setWireframe(preset.wireframe);
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    if (gradientRef.current) {
      gradientRef.current.destroy();
    }

    gradientRef.current = new NeatGradient({
      ...currentPreset, // Pass all extracted properties like shapeType, iridescence, etc
      ref: canvasRef.current,
      colors: colors,
      speed: speed,
      waveAmplitude: waveAmplitude,
      grainIntensity: grainIntensity,
      colorBlending: colorBlending,
      shadows: shadows,
      highlights: highlights,
      wireframe: wireframe,
      backgroundColor: '#0b1326',
      backgroundAlpha: 1
    });

    return () => {
      gradientRef.current?.destroy();
      gradientRef.current = null;
    };
  }, [currentPreset, colors, speed, waveAmplitude, grainIntensity, colorBlending, shadows, highlights, wireframe]);

  const updateColor = (index: number, newColor: string) => {
    setColors(current => current.map((c, i) => i === index ? { ...c, color: newColor } : c));
  };

  const toggleColor = (index: number) => {
    setColors(current => current.map((c, i) => i === index ? { ...c, enabled: !c.enabled } : c));
  };

  const reactCodeSnippet = `import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const gradient = new NeatGradient({
      ref: canvasRef.current,
      colors: ${JSON.stringify(colors, null, 2).replace(/\n/g, "\n      ")},
      speed: ${speed},
      waveAmplitude: ${waveAmplitude},
      grainIntensity: ${grainIntensity},
      colorBlending: ${colorBlending},
      shadows: ${shadows},
      highlights: ${highlights},
      wireframe: ${wireframe}
    });
    return () => gradient.destroy();
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />;
};`;

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
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1">WebGL Mesh Gradient Studio</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
              Construct fluid, GPU-accelerated 3D mesh gradients with custom wave amplitudes, grain injection, and complex color blending architectures. 
            </p>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap shrink-0">
            <button onClick={() => navigator.clipboard.writeText(reactCodeSnippet)} className="flex items-center gap-space-xs h-10 px-space-md rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-primary transition-all">
              <span className="material-symbols-outlined text-body-lg">data_object</span>
              <span>Copy React Component</span>
            </button>
          </div>
        </div>

        <div className="w-full max-w-[1800px] px-gutter py-space-lg flex flex-col xl:flex-row gap-space-lg mx-auto">
          <div className="flex-1 flex flex-col gap-space-md">
            <div className="relative w-full h-[600px] xl:h-[750px] rounded-2xl overflow-hidden shadow-2xl bg-surface-container-lowest border border-outline-variant/20">
              {/* Wrap the canvas in a slightly larger container and shift it to hide the bottom-right watermark */}
              <div className="absolute w-[104%] h-[104%] -left-[2%] -top-[2%] z-0">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full block" 
                />
              </div>
            </div>
          </div>

          {/* Right Area: Inspector */}
          <div className="w-full xl:w-96 bg-surface-container-low rounded-2xl p-space-md flex flex-col gap-space-lg border border-outline-variant/20 shrink-0 shadow-xl overflow-y-auto max-h-[800px]">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary">tune</span>
              <span className="font-headline-sm font-bold text-on-surface">Shader Controls</span>
            </div>

            <div className="flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl border border-outline-variant/10 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="font-label-sm text-outline uppercase tracking-wider font-bold">Preset</label>
                  </div>
                  <div className="relative">
                    <select 
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        if (idx >= 0) loadPreset(neatPresets[idx]);
                      }}
                      className="w-full appearance-none bg-surface-container-low border border-outline-variant/30 text-on-surface p-3 rounded-xl font-label-md hover:border-primary focus:border-primary focus:outline-none transition-colors cursor-pointer shadow-inner"
                    >
                      <option value="-1">Select a Preset...</option>
                      {neatPresets.map((preset, idx) => (
                        <option key={idx} value={idx}>
                          {preset.name}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 gap-2">
                  {colors.map((c, i) => (
                    <div 
                      key={i} 
                      className={`relative w-12 h-12 rounded-xl border-2 overflow-hidden shadow-sm transition-all group ${
                        c.enabled ? 'border-outline-variant/20 hover:border-primary' : 'border-outline-variant/10 opacity-40 grayscale'
                      }`}
                      style={{
                        background: c.enabled ? c.color : 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.1) 4px, rgba(255,255,255,0.1) 8px)'
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center bg-black/40 transition-opacity">
                        <button 
                          onClick={() => toggleColor(i)}
                          className="w-full h-full flex items-center justify-center"
                          title={c.enabled ? "Disable Color" : "Enable Color"}
                        >
                          <span className="material-symbols-outlined text-white text-sm">
                            {c.enabled ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                      
                      {c.enabled && (
                        <input 
                          type="color" 
                          value={c.color} 
                          onChange={e => updateColor(i, e.target.value)}
                          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0"
                          title="Change Color"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-outline-variant/20 my-2"></div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Animation Speed</span>
                  <span className="font-mono text-primary font-bold">{speed}</span>
                </div>
                <input 
                  type="range" min="1" max="10" step="1" 
                  value={speed} onChange={e => setSpeed(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Wave Amplitude</span>
                  <span className="font-mono text-primary font-bold">{waveAmplitude}</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="0.5" 
                  value={waveAmplitude} onChange={e => setWaveAmplitude(parseFloat(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Grain Intensity</span>
                  <span className="font-mono text-primary font-bold">{grainIntensity.toFixed(2)}</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.05" 
                  value={grainIntensity} onChange={e => setGrainIntensity(parseFloat(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Color Blending</span>
                  <span className="font-mono text-primary font-bold">{colorBlending}</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1" 
                  value={colorBlending} onChange={e => setColorBlending(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Shadows</span>
                  <span className="font-mono text-primary font-bold">{shadows}</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1" 
                  value={shadows} onChange={e => setShadows(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-label-md">
                  <span>Highlights</span>
                  <span className="font-mono text-primary font-bold">{highlights}</span>
                </div>
                <input 
                  type="range" min="0" max="10" step="1" 
                  value={highlights} onChange={e => setHighlights(parseInt(e.target.value))}
                  className="w-full accent-primary" 
                />
              </div>

              <label className="flex items-center gap-2 mt-2 p-2 rounded bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer border border-outline-variant/10">
                <input 
                  type="checkbox" 
                  checked={wireframe} 
                  onChange={e => setWireframe(e.target.checked)}
                  className="w-4 h-4 accent-primary" 
                />
                <span className="font-label-md select-none flex-1">Wireframe Mesh</span>
              </label>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
