const fs = require('fs');

const newNav = (activePath) => {
  const links = [
    { href: '/', label: 'Directory' },
    { href: '/tools/font-checker', label: 'Font Checker' },
    { href: '/tools/gradient-builder', label: 'Gradient Builder' },
    { href: '/tools/mesh-gradient-studio', label: 'Mesh Studio' },
    { href: '/tools/color-palettes', label: 'Color Palettes' },
  ];

  let navInnerHtml = '';
  links.forEach(l => {
    if (l.href === activePath) {
      navInnerHtml += `<a aria-current=\\"page\\" class=\\"px-space-md py-space-sm font-label-lg transition-colors bg-primary-container text-on-primary-container rounded-lg font-bold\\" href=\\"${l.href}\\">${l.label}</a>`;
    } else {
      navInnerHtml += `<a class=\\"px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-lg\\" href=\\"${l.href}\\">${l.label}</a>`;
    }
  });

  return `<nav class=\\"hidden xl:flex items-center gap-space-xs\\">${navInnerHtml}</nav>`;
};

const newNavJSX = (activePath) => {
  const links = [
    { href: '/', label: 'Directory' },
    { href: '/tools/font-checker', label: 'Font Checker' },
    { href: '/tools/gradient-builder', label: 'Gradient Builder' },
    { href: '/tools/mesh-gradient-studio', label: 'Mesh Studio' },
    { href: '/tools/color-palettes', label: 'Color Palettes' },
  ];

  let navInnerHtml = '';
  links.forEach(l => {
    if (l.href === activePath) {
      navInnerHtml += `\n            <a href="${l.href}" aria-current="page" className="px-space-md py-space-sm font-label-lg transition-colors bg-primary-container text-on-primary-container rounded-lg font-bold">${l.label}</a>`;
    } else {
      navInnerHtml += `\n            <a href="${l.href}" className="px-space-md py-space-sm font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors rounded-lg">${l.label}</a>`;
    }
  });

  return `<nav className="hidden xl:flex items-center gap-space-xs">${navInnerHtml}\n          </nav>`;
};


const updateHTMLStringNav = (filepath, activePath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  const regex = /<nav class=\\"hidden xl:flex items-center gap-space-xs\\".*?<\/nav>/;
  if (regex.test(content)) {
    content = content.replace(regex, newNav(activePath));
    fs.writeFileSync(filepath, content);
    console.log(`Updated nav in ${filepath}`);
  } else {
    console.log(`Nav not found in ${filepath} using HTML string regex`);
  }
};

const updateJSXNav = (filepath, activePath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  const regex = /<nav className="hidden xl:flex items-center gap-space-xs">([\s\S]*?)<\/nav>/;
  if (regex.test(content)) {
    content = content.replace(regex, newNavJSX(activePath));
    fs.writeFileSync(filepath, content);
    console.log(`Updated nav in ${filepath}`);
  } else {
    console.log(`Nav not found in ${filepath} using JSX regex`);
  }
};

updateHTMLStringNav('src/app/page.tsx', '/');
updateHTMLStringNav('src/app/tools/font-checker/page.tsx', '/tools/font-checker');
updateHTMLStringNav('src/app/tools/color-palettes/page.tsx', '/tools/color-palettes');

updateJSXNav('src/app/tools/gradient-builder/page.tsx', '/tools/gradient-builder');
updateJSXNav('src/app/tools/mesh-gradient-studio/page.tsx', '/tools/mesh-gradient-studio');
