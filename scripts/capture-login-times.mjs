// scripts/capture-login-times.mjs
import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/redesign-screens');

async function capture() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to http://localhost:3000/login...');
    await page.goto('http://localhost:3000/login', { waitUntil: ['domcontentloaded', 'networkidle2'] });
    await new Promise((r) => setTimeout(r, 1200));

    // 1. Real-time capture
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-reference-realtime.png') });
    console.log('Captured login-reference-realtime.png');

    // 2. Click time atmosphere dropdown and select Senja (Sunset)
    const timeBtn = await page.$('button[aria-label="Pengaturan Waktu Suasana Sanctuary"]');
    if (timeBtn) {
      await timeBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      // Click Senja option
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const senjaBtn = btns.find((b) => b.innerText.includes('Senja'));
        if (senjaBtn) senjaBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-reference-sunset.png') });
      console.log('Captured login-reference-sunset.png');

      // 3. Click Malam (Night)
      await timeBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const nightBtn = btns.find((b) => b.innerText.includes('Malam'));
        if (nightBtn) nightBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-reference-night.png') });
      console.log('Captured login-reference-night.png');

      // 4. Click Fajar (Sunrise)
      await timeBtn.click();
      await new Promise((r) => setTimeout(r, 300));
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const sunriseBtn = btns.find((b) => b.innerText.includes('Fajar'));
        if (sunriseBtn) sunriseBtn.click();
      });
      await new Promise((r) => setTimeout(r, 1000));
      await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-reference-sunrise.png') });
      console.log('Captured login-reference-sunrise.png');
    }

    // 5. Mobile viewport capture
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto('http://localhost:3000/login', { waitUntil: ['domcontentloaded', 'networkidle2'] });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, 'login-reference-mobile.png') });
    console.log('Captured login-reference-mobile.png');

  } finally {
    await browser.close();
  }
}

capture().catch(console.error);
