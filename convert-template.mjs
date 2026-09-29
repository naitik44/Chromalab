import fs from 'fs';
import path from 'path';

const SRC_DIR = 'E:\\Naitik\\Chromalab\\stitch_chroma_lab_design_dashboard\\stitch_chroma_lab_design_dashboard';
const DEST_DIR = 'E:\\Naitik\\Chromalab\\chroma-lab\\src\\app';

const pages = [
  { templatePath: 'chroma_lab_visual_graphic_design_directory', nextPath: 'page.tsx' },
  { templatePath: 'chroma_lab_font_checker', nextPath: 'tools/font-checker/page.tsx' },
  { templatePath: 'chroma_lab_gradient_builder', nextPath: 'tools/gradient-builder/page.tsx' },
  { templatePath: 'chroma_lab_color_palettes', nextPath: 'tools/color-palettes/page.tsx' }
];

for (const page of pages) {
  const htmlFilePath = path.join(SRC_DIR, page.templatePath, 'code.html');
  if (!fs.existsSync(htmlFilePath)) {
    console.log(`Skipping ${page.templatePath}: Not found`);
    continue;
  }
  
  const content = fs.readFileSync(htmlFilePath, 'utf-8');
  
  // Extract body content (excluding the <script> tags at the end)
  const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) continue;
  
  let bodyContent = bodyMatch[1];
  
  // Extract custom script
  const scripts = [];
  const scriptRegex = /<script>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = scriptRegex.exec(bodyContent)) !== null) {
    scripts.push(match[1]);
  }
  
  // Remove scripts from body
  bodyContent = bodyContent.replace(/<script>[\s\S]*?<\/script>/gi, '');
  
  // Replace DOMContentLoaded with setTimeout so we don't break the brace matching
  let finalScript = scripts.join('\n');
  finalScript = finalScript.replace(/document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/g, 'setTimeout(() => {');

  // Also replace some Next.js conflicting HTML (class -> className, etc? No, dangerouslySetInnerHTML takes raw HTML!)
  // Wait, React dangerouslySetInnerHTML takes raw HTML strings perfectly fine!
  
  const jsxCode = `"use client";
import { useEffect, useRef } from 'react';

export default function TemplatePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Execute the vanilla JS script from the template
    try {
      ;${finalScript}
    } catch (err) {
      console.error("Template script error", err);
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      dangerouslySetInnerHTML={{ __html: ${JSON.stringify(bodyContent)} }} 
      className="template-container w-full min-h-screen flex flex-col"
    />
  );
}
`;

  const destPath = path.join(DEST_DIR, page.nextPath);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, jsxCode);
  console.log(`Successfully converted ${page.templatePath} -> ${page.nextPath}`);
}
