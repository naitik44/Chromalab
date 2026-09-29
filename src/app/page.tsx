"use client";
import { useEffect, useRef } from 'react';

export default function TemplatePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Execute the vanilla JS script from the template
    try {
      ;
    setTimeout(() => {
      // 1. GRADIENT PLAYGROUND CONTROLS
      const viewport = document.getElementById('gradient-viewport');
      const cssText = document.getElementById('css-code-text');
      const angleSlider = document.getElementById('angle-slider');
      const angleDisplay = document.getElementById('angle-display');
      const viewportLabel = document.getElementById('viewport-label');
      const copyStatus = document.getElementById('copy-status');
      const copyBtn = document.getElementById('copy-css-btn');
      const copyQuickBtn = document.getElementById('copy-quick-action');
      const randomizeBtn = document.getElementById('randomize-btn');
      
      const c1 = document.getElementById('color-picker-1');
      const c2 = document.getElementById('color-picker-2');
      const c3 = document.getElementById('color-picker-3');
      
      let currentMode = 'linear';
      let currentAngle = 135;

      function updateGradient() {
        let gradientStyle = '';
        if (currentMode === 'linear') {
          gradientStyle = `linear-gradient(${currentAngle}deg, ${c1.value} 0%, ${c2.value} 52%, ${c3.value} 100%)`;
          viewportLabel.textContent = `${currentAngle}° • 3 STOPS (LINEAR)`;
        } else if (currentMode === 'radial') {
          gradientStyle = `radial-gradient(circle at center, ${c1.value} 0%, ${c2.value} 60%, ${c3.value} 100%)`;
          viewportLabel.textContent = `RADIAL • 3 STOPS`;
        } else if (currentMode === 'conic') {
          gradientStyle = `conic-gradient(from ${currentAngle}deg at 50% 50%, ${c1.value} 0%, ${c2.value} 50%, ${c3.value} 100%)`;
          viewportLabel.textContent = `CONIC • ${currentAngle}° ROTATION`;
        } else if (currentMode === 'mesh') {
          gradientStyle = `radial-gradient(at 0% 0%, ${c1.value} 0px, transparent 50%), radial-gradient(at 100% 0%, ${c2.value} 0px, transparent 50%), radial-gradient(at 50% 100%, ${c3.value} 0px, transparent 50%)`;
          viewportLabel.textContent = `CSS MESH • 3 CENTROIDS`;
        }

        viewport.style.background = gradientStyle;
        cssText.textContent = `background: ${gradientStyle};`;
      }

      if (angleSlider) {
        angleSlider.addEventListener('input', (e) => {
          currentAngle = e.target.value;
          angleDisplay.textContent = `${currentAngle}°`;
          updateGradient();
        });
      }

      [c1, c2, c3].forEach(picker => {
        if (picker) {
          picker.addEventListener('input', updateGradient);
        }
      });

      // Quick Angle Presets
      document.querySelectorAll('.angle-preset').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.angle-preset').forEach(b => {
            b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-medium');
            b.classList.add('bg-surface-container-high', 'text-on-surface-variant');
          });
          btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-medium');
          btn.classList.remove('bg-surface-container-high', 'text-on-surface-variant');
          currentAngle = btn.dataset.angle;
          angleSlider.value = currentAngle;
          angleDisplay.textContent = `${currentAngle}°`;
          updateGradient();
        });
      });

      // Blend Mode Tabs
      document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.mode-btn').forEach(b => {
            b.classList.remove('bg-primary', 'text-on-primary', 'font-medium');
            b.classList.add('text-on-surface-variant');
          });
          btn.classList.add('bg-primary', 'text-on-primary', 'font-medium');
          btn.classList.remove('text-on-surface-variant');
          currentMode = btn.dataset.mode;
          updateGradient();
        });
      });

      // Randomize Palette
      if (randomizeBtn) {
        randomizeBtn.addEventListener('click', () => {
          const randHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
          c1.value = randHex();
          c2.value = randHex();
          c3.value = randHex();
          updateGradient();
        });
      }

      // Copy CSS Trigger
      function copyClipboard() {
        navigator.clipboard.writeText(cssText.textContent).then(() => {
          copyStatus.classList.remove('opacity-0');
          setTimeout(() => {
            copyStatus.classList.add('opacity-0');
          }, 2000);
        });
      }

      if (copyBtn) copyBtn.addEventListener('click', copyClipboard);
      if (copyQuickBtn) copyQuickBtn.addEventListener('click', copyClipboard);

      // 2. FONT STRESS TEST LIVE BINDING
      const headlineSelect = document.getElementById('font-family-select');
      const bodySelect = document.getElementById('body-font-select');
      const sizeSlider = document.getElementById('size-slider');
      const sizeVal = document.getElementById('size-val');
      const leadingSlider = document.getElementById('leading-slider');
      const leadingVal = document.getElementById('leading-val');
      const trackingSlider = document.getElementById('tracking-slider');
      const trackingVal = document.getElementById('tracking-val');
      const dynamicHeadline = document.getElementById('dynamic-headline');
      const dynamicBody = document.getElementById('dynamic-body');
      const specimenTag = document.getElementById('specimen-tag');
      const weightButtons = document.querySelectorAll('.weight-btn');

      let currentWeight = '800';

      function applyTypography() {
        if (dynamicHeadline) {
          dynamicHeadline.style.fontFamily = `'${headlineSelect.value}', sans-serif`;
          dynamicHeadline.style.fontSize = `${sizeSlider.value}px`;
          dynamicHeadline.style.lineHeight = leadingSlider.value;
          dynamicHeadline.style.letterSpacing = `${trackingSlider.value}em`;
          dynamicHeadline.style.fontWeight = currentWeight;
        }

        if (dynamicBody) {
          dynamicBody.style.fontFamily = `'${bodySelect.value}', sans-serif`;
        }

        if (specimenTag) {
          specimenTag.textContent = `${headlineSelect.value} ${currentWeight}`;
        }
      }

      if (headlineSelect) headlineSelect.addEventListener('change', applyTypography);
      if (bodySelect) bodySelect.addEventListener('change', applyTypography);

      if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
          sizeVal.textContent = `${e.target.value}px`;
          applyTypography();
        });
      }

      if (leadingSlider) {
        leadingSlider.addEventListener('input', (e) => {
          leadingVal.textContent = `${e.target.value}x`;
          applyTypography();
        });
      }

      if (trackingSlider) {
        trackingSlider.addEventListener('input', (e) => {
          trackingVal.textContent = `${e.target.value}em`;
          applyTypography();
        });
      }

      weightButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          weightButtons.forEach(b => {
            b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-bold');
            b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
          });
          btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-bold');
          btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
          currentWeight = btn.dataset.weight;
          applyTypography();
        });
      });

      // Quick Type Presets
      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.preset-btn').forEach(b => {
            b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-medium');
            b.classList.add('bg-surface-container-high', 'text-on-surface');
          });
          btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-medium');
          btn.classList.remove('bg-surface-container-high', 'text-on-surface');

          const p = btn.dataset.preset;
          if (p === 'tech') {
            headlineSelect.value = 'Space Grotesk';
            bodySelect.value = 'Inter';
            sizeSlider.value = 34;
            trackingSlider.value = -0.03;
          } else if (p === 'editorial') {
            headlineSelect.value = 'Clash Display';
            bodySelect.value = 'General Sans';
            sizeSlider.value = 42;
            trackingSlider.value = -0.01;
          } else if (p === 'brutalist') {
            headlineSelect.value = 'Syne';
            bodySelect.value = 'Work Sans';
            sizeSlider.value = 46;
            trackingSlider.value = 0.02;
          } else if (p === 'minimal') {
            headlineSelect.value = 'Plus Jakarta Sans';
            bodySelect.value = 'Satoshi';
            sizeSlider.value = 32;
            trackingSlider.value = -0.02;
          }
          sizeVal.textContent = `${sizeSlider.value}px`;
          trackingVal.textContent = `${trackingSlider.value}em`;
          applyTypography();
        });
      });

      // Reset Defaults
      const resetBtn = document.getElementById('reset-type-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          headlineSelect.value = 'Plus Jakarta Sans';
          bodySelect.value = 'Inter';
          sizeSlider.value = 36;
          leadingSlider.value = 1.25;
          trackingSlider.value = -0.02;
          currentWeight = '800';
          sizeVal.textContent = '36px';
          leadingVal.textContent = '1.25x';
          trackingVal.textContent = '-0.02em';
          applyTypography();
        });
      }

      // 3. DIRECTORY CATEGORY PILLS ACTIVE STATE
      document.querySelectorAll('.category-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.category-pill').forEach(b => {
            b.classList.remove('bg-primary-container', 'text-on-primary-container', 'font-medium');
            b.classList.add('bg-surface-container', 'text-on-surface-variant');
          });
          btn.classList.add('bg-primary-container', 'text-on-primary-container', 'font-medium');
          btn.classList.remove('bg-surface-container', 'text-on-surface-variant');
        });
      });

      // Software filter tags toggle
      document.querySelectorAll('.soft-filter').forEach(btn => {
        btn.addEventListener('click', () => {
          const dot = btn.querySelector('span');
          if (btn.classList.contains('active-tag')) {
            btn.classList.remove('active-tag');
            dot.classList.remove('bg-primary');
            dot.classList.add('bg-surface-variant');
          } else {
            btn.classList.add('active-tag');
            dot.classList.add('bg-primary');
            dot.classList.remove('bg-surface-variant');
          }
        });
      });

    });
  
    } catch (err) {
      console.error("Template script error", err);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      dangerouslySetInnerHTML={{ __html: "<header class=\"fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between\"><div class=\"flex items-center gap-4\"><a href=\"/\" class=\"font-black text-xl tracking-tighter text-blue-600\">CHROMA LAB</a><div class=\"hidden md:flex items-center gap-4 text-sm font-semibold text-gray-500\"><a href=\"/tools/color-palettes\" class=\"cursor-pointer hover:text-black transition-colors\">Palettes</a><a href=\"/tools/font-checker\" class=\"cursor-pointer hover:text-black transition-colors\">Fonts</a><a href=\"/tools/gradient-builder\" class=\"cursor-pointer hover:text-black transition-colors\">Gradients</a><a href=\"/tools/mesh-gradient-studio\" class=\"cursor-pointer hover:text-black transition-colors\">Mesh</a></div></div></header><main class=\"w-full pt-16 flex-1 bg-background\"><div class=\"flex flex-col w-full text-on-surface\">\n<!-- Ambient Glow Canvas Layer -->\n<div class=\"relative w-full overflow-hidden\">\n<div class=\"pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 rounded-full blur-[140px] -z-10\"></div>\n<div class=\"pointer-events-none absolute top-96 right-10 w-[550px] h-[450px] bg-secondary-container/20 rounded-full blur-[160px] -z-10\"></div>\n<!-- 1. HERO SECTION -->\n<section class=\"w-full px-gutter pt-12 pb-16 max-w-7xl mx-auto flex flex-col items-center text-center\">\n<!-- Live Release Pill Badge -->\n<div class=\"inline-flex items-center gap-space-xs px-3.5 py-1 rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-md mb-6\">\n<span class=\"relative flex h-2 w-2\">\n<span class=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80\"></span>\n<span class=\"relative inline-flex rounded-full h-2 w-2 bg-primary\"></span>\n</span>\n<span class=\"font-label-sm text-label-sm text-primary tracking-wide uppercase\">v2.4 Released</span>\n<span class=\"text-on-surface-variant font-body-sm text-body-sm\">•</span>\n<span class=\"font-label-sm text-label-sm text-on-surface-variant tracking-normal\">1,400+ Curated Design Assets</span>\n</div>\n<!-- Main Headline -->\n<h1 class=\"font-headline-xl text-headline-xl max-w-4xl tracking-tight text-on-surface mb-6\">\n        The Utility Engine for <span class=\"bg-gradient-to-r from-primary via-secondary to-tertiary-fixed bg-clip-text text-transparent\">Visual & Graphic Designers</span>.\n      </h1>\n<!-- Subheadline -->\n<p class=\"font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8\">\n        Test typography on real UI layouts, craft multi-format CSS & SVG gradients, and discover verified tools engineered for brand, vector, and editorial design.\n      </p>\n<!-- Action Buttons -->\n<div class=\"flex flex-wrap items-center justify-center gap-space-md mb-12\">\n<a class=\"inline-flex items-center gap-space-xs px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold shadow-[0_0_24px_rgba(6,182,212,0.35)] hover:bg-primary transition-all duration-200\" href=\"#font-stress-test\">\n<span>Launch Font Checker</span>\n<span class=\"material-symbols-outlined text-body-lg\">arrow_forward</span>\n</a>\n<a class=\"inline-flex items-center gap-space-xs px-6 py-3 rounded-lg bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-bright transition-colors shadow-sm\" href=\"#directory\">\n<span class=\"material-symbols-outlined text-body-lg\">explore</span>\n<span>Explore Directory</span>\n</a>\n</div>\n<!-- Live Metadata Strip -->\n<div class=\"flex flex-wrap items-center justify-center gap-6 md:gap-12 py-3 px-6 rounded-xl bg-surface-container-low/70 backdrop-blur-md shadow-sm\">\n<div class=\"flex items-center gap-2\">\n<span class=\"material-symbols-outlined text-primary text-body-md\">speed</span>\n<span class=\"font-label-md text-label-md text-on-surface font-medium\">24.5k</span>\n<span class=\"font-body-sm text-body-sm text-on-surface-variant\">Daily Renders</span>\n</div>\n<div class=\"h-3.5 w-px bg-surface-variant\"></div>\n<div class=\"flex items-center gap-2\">\n<span class=\"material-symbols-outlined text-tertiary text-body-md\">verified</span>\n<span class=\"font-label-md text-label-md text-on-surface font-medium\">180+</span>\n<span class=\"font-body-sm text-body-sm text-on-surface-variant\">Open Source Utilities</span>\n</div>\n<div class=\"h-3.5 w-px bg-surface-variant\"></div>\n<div class=\"flex items-center gap-2\">\n<span class=\"material-symbols-outlined text-secondary text-body-md\">shield</span>\n<span class=\"font-label-md text-label-md text-on-surface font-medium\">Zero Ads</span>\n<span class=\"font-body-sm text-body-sm text-on-surface-variant\">Always Free Access</span>\n</div>\n</div>\n</section>\n<!-- 2. QUICK GRADIENT PLAYGROUND (Hero Interactive Workbench) -->\n<section class=\"w-full px-gutter max-w-7xl mx-auto mb-24\">\n<div class=\"w-full rounded-2xl bg-surface-container/90 backdrop-blur-xl shadow-2xl p-6 md:p-8\">\n<!-- Header & Blend Mode Switcher -->\n<div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 bg-surface-container-low/40 p-4 rounded-xl\">\n<div class=\"flex items-center gap-3\">\n<div class=\"w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary\">\n<span class=\"material-symbols-outlined\">palette</span>\n</div>\n<div>\n<div class=\"flex items-center gap-2\">\n<h3 class=\"font-headline-sm text-headline-sm text-on-surface\">Interactive Gradient Sandbox</h3>\n<span class=\"px-2 py-0.5 rounded bg-surface-container-highest text-tertiary font-label-sm text-label-sm\">LIVE CSS3</span>\n</div>\n<p class=\"font-body-sm text-body-sm text-on-surface-variant\">Inspect, interpolate, and extract production-grade gradient vectors.</p>\n</div>\n</div>\n<!-- Blend Mode Tabs -->\n<div class=\"inline-flex p-1 rounded-lg bg-surface-container-lowest\" id=\"blend-mode-tabs\">\n<button class=\"px-3.5 py-1.5 rounded-md font-label-md text-label-md bg-primary text-on-primary font-medium transition-all mode-btn\" data-mode=\"linear\" type=\"button\">Linear</button>\n<button class=\"px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all mode-btn\" data-mode=\"radial\" type=\"button\">Radial</button>\n<button class=\"px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all mode-btn\" data-mode=\"conic\" type=\"button\">Conic</button>\n<button class=\"px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all mode-btn\" data-mode=\"mesh\" type=\"button\">Mesh CSS</button>\n</div>\n</div>\n<!-- Playground Grid -->\n<div class=\"grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch\">\n<!-- Live Preview Canvas -->\n<div class=\"lg:col-span-7 flex flex-col justify-between rounded-xl p-6 min-h-[340px] relative overflow-hidden transition-all duration-300 shadow-inner\" id=\"gradient-viewport\" style=\"background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 52%, #ec4899 100%);\">\n<div class=\"flex items-center justify-between z-10\">\n<span class=\"px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-label-sm text-label-sm text-on-surface tracking-wider font-mono uppercase\" id=\"viewport-label\">135° • 3 STOPS</span>\n<button class=\"px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-label-sm text-label-sm text-on-surface hover:text-primary flex items-center gap-1 transition-colors\" id=\"randomize-btn\" type=\"button\">\n<span class=\"material-symbols-outlined text-body-sm\">casino</span>\n<span>Randomize</span>\n</button>\n</div>\n<!-- CSS Code Snippet Floating Card -->\n<div class=\"z-10 rounded-xl bg-surface-container-lowest/90 backdrop-blur-xl p-4 shadow-xl\">\n<div class=\"flex items-center justify-between mb-2\">\n<span class=\"font-label-sm text-label-sm text-on-surface-variant font-mono\">css output</span>\n<span class=\"font-label-sm text-label-sm text-tertiary opacity-0 transition-opacity\" id=\"copy-status\">Copied to clipboard!</span>\n</div>\n<div class=\"flex items-center justify-between gap-3\">\n<code class=\"font-mono text-body-sm text-primary overflow-x-auto whitespace-nowrap scrollbar-none\" id=\"css-code-text\">background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 52%, #ec4899 100%);</code>\n<button class=\"shrink-0 p-2 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface transition-colors\" id=\"copy-css-btn\" title=\"Copy CSS snippet\" type=\"button\">\n<span class=\"material-symbols-outlined text-body-md\">content_copy</span>\n</button>\n</div>\n</div>\n</div>\n<!-- Gradient Controls Rail -->\n<div class=\"lg:col-span-5 flex flex-col justify-between gap-5 bg-surface-container-lowest p-6 rounded-xl\">\n<!-- Color Stops List -->\n<div>\n<div class=\"flex items-center justify-between mb-3\">\n<span class=\"font-label-md text-label-md text-on-surface font-semibold\">Active Color Stops</span>\n<span class=\"font-label-sm text-label-sm text-on-surface-variant\">3 Anchor Points</span>\n</div>\n<div class=\"space-y-3\" id=\"stops-container\">\n<!-- Stop 1 -->\n<div class=\"flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface-container-low\">\n<div class=\"flex items-center gap-3\">\n<input class=\"w-8 h-8 rounded cursor-pointer bg-transparent border-none appearance-none\" id=\"color-picker-1\" type=\"color\" value=\"#06b6d4\"/>\n<span class=\"font-mono text-label-md text-on-surface\">#06B6D4</span>\n</div>\n<div class=\"flex items-center gap-2\">\n<span class=\"font-mono text-body-sm text-on-surface-variant\">0%</span>\n<span class=\"w-3 h-3 rounded-full bg-[#06b6d4]\"></span>\n</div>\n</div>\n<!-- Stop 2 -->\n<div class=\"flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface-container-low\">\n<div class=\"flex items-center gap-3\">\n<input class=\"w-8 h-8 rounded cursor-pointer bg-transparent border-none appearance-none\" id=\"color-picker-2\" type=\"color\" value=\"#8b5cf6\"/>\n<span class=\"font-mono text-label-md text-on-surface\">#8B5CF6</span>\n</div>\n<div class=\"flex items-center gap-2\">\n<span class=\"font-mono text-body-sm text-on-surface-variant\">52%</span>\n<span class=\"w-3 h-3 rounded-full bg-[#8b5cf6]\"></span>\n</div>\n</div>\n<!-- Stop 3 -->\n<div class=\"flex items-center justify-between gap-3 p-2.5 rounded-lg bg-surface-container-low\">\n<div class=\"flex items-center gap-3\">\n<input class=\"w-8 h-8 rounded cursor-pointer bg-transparent border-none appearance-none\" id=\"color-picker-3\" type=\"color\" value=\"#ec4899\"/>\n<span class=\"font-mono text-label-md text-on-surface\">#EC4899</span>\n</div>\n<div class=\"flex items-center gap-2\">\n<span class=\"font-mono text-body-sm text-on-surface-variant\">100%</span>\n<span class=\"w-3 h-3 rounded-full bg-[#ec4899]\"></span>\n</div>\n</div>\n</div>\n</div>\n<!-- Angle Selector & Slider -->\n<div>\n<div class=\"flex items-center justify-between mb-2\">\n<label class=\"font-label-md text-label-md text-on-surface font-semibold\" for=\"angle-slider\">Direction Angle</label>\n<span class=\"font-mono text-body-sm text-primary font-semibold\" id=\"angle-display\">135°</span>\n</div>\n<input class=\"w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary mb-3\" id=\"angle-slider\" max=\"360\" min=\"0\" type=\"range\" value=\"135\"/>\n<!-- Quick Angle Presets -->\n<div class=\"grid grid-cols-4 gap-2\">\n<button class=\"angle-preset py-1.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright font-mono text-label-sm text-center transition-colors\" data-angle=\"90\" type=\"button\">90°</button>\n<button class=\"angle-preset py-1.5 rounded bg-primary-container text-on-primary-container font-mono text-label-sm text-center transition-colors font-medium\" data-angle=\"135\" type=\"button\">135°</button>\n<button class=\"angle-preset py-1.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright font-mono text-label-sm text-center transition-colors\" data-angle=\"180\" type=\"button\">180°</button>\n<button class=\"angle-preset py-1.5 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface hover:bg-surface-bright font-mono text-label-sm text-center transition-colors\" data-angle=\"270\" type=\"button\">270°</button>\n</div>\n</div>\n<!-- Action Strip -->\n<div class=\"flex items-center gap-3 pt-2\">\n<button class=\"flex-1 py-2.5 px-4 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors\" id=\"export-svg-btn\" type=\"button\">\n<span class=\"material-symbols-outlined text-body-md\">download</span>\n<span>Export SVG</span>\n</button>\n<button class=\"flex-1 py-2.5 px-4 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary font-label-md text-label-md flex items-center justify-center gap-2 transition-all font-semibold\" id=\"copy-quick-action\" type=\"button\">\n<span class=\"material-symbols-outlined text-body-md\">terminal</span>\n<span>Copy Tokens</span>\n</button>\n</div>\n</div>\n</div>\n</div>\n</section>\n<!-- 3. RESOURCE DIRECTORY GRID -->\n\n<!-- 4. FONT-TO-UI PREVIEW TEASER (Interactive Split-Screen Section) -->\n<section class=\"w-full px-gutter max-w-7xl mx-auto mb-20\" id=\"font-stress-test\">\n<!-- Section Header -->\n<div class=\"mb-10 text-center md:text-left\">\n<div class=\"inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-3\">\n<span class=\"material-symbols-outlined text-body-sm\">text_fields</span>\n<span>INTERACTIVE PREVIEW</span>\n</div>\n<h2 class=\"font-headline-lg text-headline-lg text-on-surface tracking-tight\">Live Font-to-UI Stress Test</h2>\n<p class=\"font-body-md text-body-md text-on-surface-variant max-w-2xl mt-1\">\n          Never evaluate typography in sterile type drawers again. Test variable headings and micro body copy against real-world SaaS component telemetry in real time.\n        </p>\n</div>\n<!-- Split Screen Layout Container -->\n<div class=\"grid grid-cols-1 lg:grid-cols-12 gap-8 items-start\">\n<!-- Left Panel: Typography Workbench Controls -->\n<div class=\"lg:col-span-5 rounded-2xl bg-surface-container/90 backdrop-blur-xl p-6 shadow-xl space-y-6\">\n<div class=\"flex items-center justify-between pb-4 bg-surface-container-low/50 p-3 rounded-xl\">\n<div class=\"flex items-center gap-2\">\n<span class=\"material-symbols-outlined text-primary text-body-lg\">tune</span>\n<span class=\"font-label-lg text-label-lg text-on-surface font-semibold\">Type Calibrator</span>\n</div>\n<button class=\"font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors\" id=\"reset-type-btn\" type=\"button\">Reset Defaults</button>\n</div>\n<!-- Quick Pairing Presets -->\n<div>\n<label class=\"font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block mb-2 font-mono\">Curated Pairings</label>\n<div class=\"grid grid-cols-2 gap-2\" id=\"pairing-presets\">\n<button class=\"preset-btn py-2 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md text-left transition-all font-medium\" data-preset=\"tech\" type=\"button\">Modern Tech</button>\n<button class=\"preset-btn py-2 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md text-left hover:bg-surface-bright transition-all\" data-preset=\"editorial\" type=\"button\">Editorial Serif</button>\n<button class=\"preset-btn py-2 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md text-left hover:bg-surface-bright transition-all\" data-preset=\"brutalist\" type=\"button\">Neo-Brutalist</button>\n<button class=\"preset-btn py-2 px-3 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md text-left hover:bg-surface-bright transition-all\" data-preset=\"minimal\" type=\"button\">Clean Minimalist</button>\n</div>\n</div>\n<!-- Heading Font Family Selection -->\n<div>\n<label class=\"font-label-md text-label-md text-on-surface font-semibold block mb-2\" for=\"font-family-select\">Headline Font Face</label>\n<div class=\"relative\">\n<select class=\"w-full h-11 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-1 focus:ring-primary\" id=\"font-family-select\">\n<option value=\"Plus Jakarta Sans\">Plus Jakarta Sans (Variable Sans)</option>\n<option value=\"Space Grotesk\">Space Grotesk (Tech Monospace/Display)</option>\n<option value=\"Syne\">Syne (Geometric Brutalist Display)</option>\n<option value=\"Cabinet Grotesk\">Cabinet Grotesk (High-Contrast Bold)</option>\n<option value=\"Clash Display\">Clash Display (Editorial Neo-Grotesque)</option>\n</select>\n<span class=\"material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none\">expand_more</span>\n</div>\n</div>\n<!-- Body Font Select -->\n<div>\n<label class=\"font-label-md text-label-md text-on-surface font-semibold block mb-2\" for=\"body-font-select\">Body UI Font Face</label>\n<div class=\"relative\">\n<select class=\"w-full h-11 px-3 pr-8 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-1 focus:ring-primary\" id=\"body-font-select\">\n<option value=\"Inter\">Inter (System Standard UI)</option>\n<option value=\"General Sans\">General Sans (Modern Clean)</option>\n<option value=\"Satoshi\">Satoshi (Neutral Neo-Humanist)</option>\n<option value=\"Work Sans\">Work Sans (Screen Optimized)</option>\n</select>\n<span class=\"material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none\">expand_more</span>\n</div>\n</div>\n<!-- Sliders: Headline Size, Line Height, Tracking -->\n<div class=\"space-y-4 pt-2\">\n<div>\n<div class=\"flex justify-between items-center mb-1\">\n<span class=\"font-label-md text-label-md text-on-surface\">Headline Size</span>\n<span class=\"font-mono text-body-sm text-primary font-semibold\" id=\"size-val\">36px</span>\n</div>\n<input class=\"w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary\" id=\"size-slider\" max=\"56\" min=\"22\" type=\"range\" value=\"36\"/>\n</div>\n<div>\n<div class=\"flex justify-between items-center mb-1\">\n<span class=\"font-label-md text-label-md text-on-surface\">Line Height Ratio</span>\n<span class=\"font-mono text-body-sm text-primary font-semibold\" id=\"leading-val\">1.25x</span>\n</div>\n<input class=\"w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary\" id=\"leading-slider\" max=\"1.6\" min=\"1.0\" step=\"0.05\" type=\"range\" value=\"1.25\"/>\n</div>\n<div>\n<div class=\"flex justify-between items-center mb-1\">\n<span class=\"font-label-md text-label-md text-on-surface\">Letter Spacing</span>\n<span class=\"font-mono text-body-sm text-primary font-semibold\" id=\"tracking-val\">-0.02em</span>\n</div>\n<input class=\"w-full h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer accent-primary\" id=\"tracking-slider\" max=\"0.10\" min=\"-0.05\" step=\"0.01\" type=\"range\" value=\"-0.02\"/>\n</div>\n</div>\n<!-- Weight Toggles -->\n<div>\n<span class=\"font-label-md text-label-md text-on-surface font-semibold block mb-2\">Weight Selector</span>\n<div class=\"grid grid-cols-4 gap-2\" id=\"weight-toggles\">\n<button class=\"weight-btn py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm text-center transition-colors\" data-weight=\"400\" type=\"button\">Regular</button>\n<button class=\"weight-btn py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm text-center transition-colors\" data-weight=\"500\" type=\"button\">Medium</button>\n<button class=\"weight-btn py-1.5 rounded bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm text-center transition-colors\" data-weight=\"600\" type=\"button\">SemiBold</button>\n<button class=\"weight-btn py-1.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm text-center font-bold transition-colors\" data-weight=\"800\" type=\"button\">Bold</button>\n</div>\n</div>\n</div>\n<!-- Right Panel: Live Reactive Dashboard UI Mockup -->\n<div class=\"lg:col-span-7 rounded-2xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl relative overflow-hidden\" id=\"live-ui-target\">\n<!-- Mock Window Top Bar -->\n<div class=\"flex items-center justify-between pb-6 mb-6 bg-surface-container-low/40 p-3 rounded-xl\">\n<div class=\"flex items-center gap-2\">\n<span class=\"w-3 h-3 rounded-full bg-error\"></span>\n<span class=\"w-3 h-3 rounded-full bg-surface-variant\"></span>\n<span class=\"w-3 h-3 rounded-full bg-tertiary\"></span>\n<span class=\"ml-2 font-mono text-label-sm text-on-surface-variant\">mockup-preview.chroma-lab.io</span>\n</div>\n<div class=\"flex items-center gap-2\">\n<span class=\"px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm\">LIVE BINDING ACTIVE</span>\n</div>\n</div>\n<!-- Main UI Surface in Preview -->\n<div class=\"space-y-6\">\n<!-- Headline & Meta Component under test -->\n<div class=\"p-6 rounded-xl bg-surface-container shadow-md\">\n<span class=\"font-label-sm text-label-sm text-primary uppercase font-mono tracking-widest block mb-2\">EXECUTIVE ANALYTICS OVERVIEW</span>\n<!-- DYNAMIC HEADLINE ELEMENT -->\n<h2 class=\"text-on-surface mb-3\" id=\"dynamic-headline\" style=\"font-family: 'Plus Jakarta Sans', sans-serif; font-size: 36px; line-height: 1.25; letter-spacing: -0.02em; font-weight: 800;\">\n                Global Revenue Flow & Creative Token Metrics\n              </h2>\n<!-- DYNAMIC BODY ELEMENT -->\n<p class=\"text-on-surface-variant leading-relaxed\" id=\"dynamic-body\" style=\"font-family: 'Inter', sans-serif;\">\n                Real-time telemetry monitoring creative vector distribution across 48 worldwide edge nodes. Contrast compliance is continuously checked against accessibility standards.\n              </p>\n</div>\n<!-- Dashboard Stats Row -->\n<div class=\"grid grid-cols-1 md:grid-cols-3 gap-4\">\n<div class=\"p-4 rounded-xl bg-surface-container\">\n<span class=\"font-label-sm text-label-sm text-on-surface-variant\">MONTHLY RENDERS</span>\n<div class=\"font-headline-md text-headline-md text-on-surface font-bold mt-1\">1.84M</div>\n<div class=\"flex items-center gap-1 text-tertiary font-label-sm text-label-sm mt-1\">\n<span class=\"material-symbols-outlined text-body-sm\">trending_up</span>\n<span>+28.4% from last month</span>\n</div>\n</div>\n<div class=\"p-4 rounded-xl bg-surface-container\">\n<span class=\"font-label-sm text-label-sm text-on-surface-variant\">WCAG PASS RATE</span>\n<div class=\"font-headline-md text-headline-md text-primary font-bold mt-1\">99.4%</div>\n<div class=\"flex items-center gap-1 text-tertiary font-label-sm text-label-sm mt-1\">\n<span class=\"material-symbols-outlined text-body-sm\">check_circle</span>\n<span>AAA Verified Standard</span>\n</div>\n</div>\n<div class=\"p-4 rounded-xl bg-surface-container\">\n<span class=\"font-label-sm text-label-sm text-on-surface-variant\">COLOR ASSETS</span>\n<div class=\"font-headline-md text-headline-md text-secondary font-bold mt-1\">14,280</div>\n<div class=\"flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-1\">\n<span class=\"material-symbols-outlined text-body-sm\">sync</span>\n<span>Auto-synced Figma tokens</span>\n</div>\n</div>\n</div>\n<!-- Mini Inline Graphic: Distribution Bar -->\n<div class=\"p-5 rounded-xl bg-surface-container space-y-3\">\n<div class=\"flex justify-between items-center\">\n<span class=\"font-label-md text-label-md text-on-surface font-semibold\">Active Color Distribution (Luminance)</span>\n<span class=\"font-mono text-label-sm text-on-surface-variant\">D65 Illuminant</span>\n</div>\n<!-- Inline SVG Sparkline / Bar Graph under 2KB -->\n<div class=\"h-16 w-full flex items-end gap-1.5 pt-2\">\n<div class=\"w-full bg-primary/20 hover:bg-primary h-[35%] rounded-t transition-all\" title=\"35%\"></div>\n<div class=\"w-full bg-primary/30 hover:bg-primary h-[50%] rounded-t transition-all\" title=\"50%\"></div>\n<div class=\"w-full bg-primary/40 hover:bg-primary h-[65%] rounded-t transition-all\" title=\"65%\"></div>\n<div class=\"w-full bg-primary/60 hover:bg-primary h-[45%] rounded-t transition-all\" title=\"45%\"></div>\n<div class=\"w-full bg-primary hover:bg-primary h-[85%] rounded-t transition-all\" title=\"85%\"></div>\n<div class=\"w-full bg-primary/70 hover:bg-primary h-[70%] rounded-t transition-all\" title=\"70%\"></div>\n<div class=\"w-full bg-secondary hover:bg-secondary h-[95%] rounded-t transition-all\" title=\"95%\"></div>\n<div class=\"w-full bg-secondary/80 hover:bg-secondary h-[80%] rounded-t transition-all\" title=\"80%\"></div>\n<div class=\"w-full bg-secondary/60 hover:bg-secondary h-[60%] rounded-t transition-all\" title=\"60%\"></div>\n<div class=\"w-full bg-secondary/40 hover:bg-secondary h-[40%] rounded-t transition-all\" title=\"40%\"></div>\n<div class=\"w-full bg-tertiary hover:bg-tertiary h-[90%] rounded-t transition-all\" title=\"90%\"></div>\n<div class=\"w-full bg-tertiary/70 hover:bg-tertiary h-[65%] rounded-t transition-all\" title=\"65%\"></div>\n</div>\n</div>\n<!-- Recent Design Assets Component Table Mock -->\n<div class=\"p-4 rounded-xl bg-surface-container\">\n<div class=\"flex items-center justify-between mb-3\">\n<span class=\"font-label-md text-label-md text-on-surface font-semibold\">Loaded Design Font Specimen</span>\n<span class=\"font-mono text-label-sm text-tertiary\" id=\"specimen-tag\">Plus Jakarta Sans 800</span>\n</div>\n<div class=\"space-y-2\">\n<div class=\"flex items-center justify-between p-2.5 rounded bg-surface-container-low text-body-sm\">\n<div class=\"flex items-center gap-3\">\n<span class=\"material-symbols-outlined text-primary text-body-md\">format_size</span>\n<span class=\"font-medium text-on-surface\">The quick brown fox jumps over the lazy dog.</span>\n</div>\n<span class=\"font-mono text-on-surface-variant text-label-sm\">48 glyphs</span>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>\n</section>\n<!-- 5. NEWSLETTER & DESIGN CALLOUT BANNER -->\n<section class=\"w-full px-gutter max-w-7xl mx-auto mb-20\">\n<div class=\"relative rounded-2xl bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container p-8 md:p-12 overflow-hidden shadow-xl\">\n<div class=\"pointer-events-none absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent\"></div>\n<div class=\"relative z-10 max-w-2xl\">\n<div class=\"inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm mb-4\">\n<span class=\"material-symbols-outlined text-body-sm\">mail</span>\n<span>WEEKLY SPECTRUM DISPATCH</span>\n</div>\n<h2 class=\"font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3\">\n            Get the week’s newest vector tools, fonts & color engines.\n          </h2>\n<p class=\"font-body-md text-body-md text-on-surface-variant mb-6\">\n            Join 34,000+ visual artists, UI designers, and creative engineers. No spam, no advertisements, only precision design utility updates every Thursday.\n          </p>\n<form class=\"flex flex-col sm:flex-row gap-3 max-w-md\" onsubmit=\"event.preventDefault(); alert('Subscribed to CHROMA LAB Dispatch!');\">\n<input class=\"flex-1 h-11 px-4 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm focus:outline-none focus:ring-1 focus:ring-primary\" placeholder=\"designer@domain.com\" required=\"\" type=\"email\"/>\n<button class=\"h-11 px-6 rounded-lg bg-primary-container text-on-primary-container font-label-lg text-label-lg font-semibold hover:bg-primary transition-colors whitespace-nowrap\" type=\"submit\">\n              Join Free\n            </button>\n</form>\n</div>\n</div>\n</section>\n</div>\n<!-- Inline Client-Side Micro-Interactions Script -->\n\n</div></main><footer class=\"w-full bg-surface-container-lowest py-space-lg\"><div class=\"w-full px-gutter flex flex-col md:flex-row items-center justify-between gap-space-md\"><div class=\"font-body-sm text-body-sm text-on-surface-variant text-center md:text-left\">© 2025 CHROMA LAB. Built for the graphic design craft.</div><div class=\"flex flex-wrap items-center justify-center gap-space-lg\"><a class=\"font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors\" data-path=\"api-docs\" href=\"#\">API</a><a class=\"font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors\" data-path=\"community\" href=\"#\">Community Discord</a><a class=\"font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors\" data-path=\"github\" href=\"#\">GitHub</a><a class=\"font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors\" data-path=\"changelog\" href=\"#\">Changelog</a><div class=\"flex items-center gap-space-xs\"><span class=\"relative flex h-2 w-2\"><span class=\"animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-container opacity-75\"></span><span class=\"relative inline-flex rounded-full h-2 w-2 bg-tertiary-container\"></span></span><span class=\"font-label-sm text-label-sm text-tertiary\">Operational</span></div></div></div></footer>" }} 
      className="template-container w-full min-h-screen flex flex-col"
    />
  );
}
