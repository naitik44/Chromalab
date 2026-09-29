const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const dir = path.join('E:', 'Naitik', 'Chromalab', 'Screenshot');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    console.log("Navigating to local Mesh Studio on 3001 (127.0.0.1)...");
    await page.goto('http://127.0.0.1:3001/tools/mesh-gradient-studio', { waitUntil: 'networkidle2' });

    console.log("Waiting 3 seconds for React to mount...");
    await new Promise(r => setTimeout(r, 3000));

    console.log("Waiting for select element...");
    await page.waitForSelector('select', { timeout: 10000 });

    await page.evaluate(() => {
        const uiPanel = document.querySelector('.w-\\[380px\\]');
        if (uiPanel) uiPanel.style.display = 'none';

        const topNav = document.querySelector('.absolute.top-4');
        if (topNav) topNav.style.display = 'none';

        const bottomToolbar = document.querySelector('.absolute.bottom-6');
        if (bottomToolbar) bottomToolbar.style.display = 'none';

        const titleCenter = document.querySelector('.absolute.inset-0.flex');
        if (titleCenter) titleCenter.style.display = 'none';
        
        const canvas = document.querySelector('canvas');
        if (canvas) {
            canvas.style.zIndex = '9999';
        }
    });

    await new Promise(r => setTimeout(r, 1000));

    const options = await page.evaluate(() => {
        const select = document.querySelector('select');
        return Array.from(select.options).map(o => ({ value: o.value, text: o.text }));
    });

    console.log(`Found ${options.length} options`);

    for (let opt of options) {
        if (opt.value === "-1") continue;
        console.log(`Capturing: ${opt.text}`);
        
        await page.evaluate((val) => {
            const select = document.querySelector('select');
            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
            nativeInputValueSetter.call(select, val);
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }, opt.value);

        await new Promise(r => setTimeout(r, 1200));

        const safeName = opt.text.trim().replace(/[^a-zA-Z0-9]/g, '_');
        const outputPath = path.join(dir, `${safeName}.png`);
        await page.screenshot({ path: outputPath });
    }

    console.log("Done!");
    await browser.close();
})();
