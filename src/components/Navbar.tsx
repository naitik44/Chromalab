"use client";

import Link from "next/link";
import { Search, Sun, Moon, Plus } from "lucide-react";
import { useState, useEffect } from "react";

export function Navbar() {
  const [isDark, setIsDark] = useState(true);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border-hairline bg-surface-glass backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary p-0.5">
              <div className="h-full w-full rounded-md bg-canvas-root flex items-center justify-center group-hover:bg-opacity-0 transition-all duration-300">
                <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_8px_rgba(6,182,212,0.8)] group-hover:bg-white transition-colors" />
              </div>
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-text-primary">
              CHROMA<span className="text-primary font-normal">LAB</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/directory" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Directory</Link>
          <Link href="/tools/font-checker" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Font Checker</Link>
          <Link href="/tools/gradient-builder" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Gradient Builder</Link>
          <Link href="/tools/color-palettes" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">Color Palettes</Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-canvas-root rounded-md border border-border-hairline text-text-muted hover:border-primary/50 transition-colors cursor-pointer group">
            <Search className="w-4 h-4 group-hover:text-primary" />
            <span className="text-xs">Quick Palette</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-surface-default border border-border-hairline rounded font-mono text-text-secondary">⌘K</span>
          </div>

          <button 
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-raised border border-transparent hover:border-border-hairline transition-all"
            onClick={() => setIsDark(!isDark)}
          >
            {isDark ? <Sun className="w-4 h-4 text-text-secondary" /> : <Moon className="w-4 h-4 text-text-secondary" />}
          </button>

          <Link href="/submit" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary-hover text-canvas-root px-4 py-2 rounded-md font-semibold text-sm transition-all shadow-[0_0_16px_rgba(6,182,212,0)] hover:shadow-[0_0_16px_rgba(6,182,212,0.35)]">
            <Plus className="w-4 h-4" />
            Submit Resource
          </Link>

          {/* Profile Badge Placeholder */}
          <div className="w-9 h-9 rounded-full bg-surface-raised border border-border-hairline overflow-hidden flex items-center justify-center relative cursor-pointer group">
            <span className="text-xs font-bold text-text-secondary group-hover:text-primary">MC</span>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-semantic-green rounded-full border-2 border-canvas-root" />
          </div>
        </div>

      </div>
    </nav>
  );
}
