// scripts/capture-deliverables.mjs
import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/redesign-screens');

const PHASES = ['sunrise', 'day', 'sunset', 'night'];

async function captureAll() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();

    // 1. Desktop 1440px
    console.log('\n--- Capturing Desktop 1440px ---');
    await page.setViewport({ width: 1440, height: 900 });

    for (const phase of PHASES) {
      const url = `http://localhost:3000/login?time=${phase}`;
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      // Hide Next.js dev toast overlay
      await page.addStyleTag({
        content: 'nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay] { display: none !important; }',
      });

      // Wait for image render and smooth transition
      await new Promise((r) => setTimeout(r, 1200));

      const file = path.join(OUTPUT_DIR, `login-1440-${phase}.png`);
      await page.screenshot({ path: file });
      console.log(`✓ Saved ${file}`);
    }

    // 2. Mobile 390px
    console.log('\n--- Capturing Mobile 390px ---');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

    for (const phase of PHASES) {
      const url = `http://localhost:3000/login?time=${phase}`;
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

      await page.addStyleTag({
        content: 'nextjs-portal, [data-nextjs-toast], [data-nextjs-dialog-overlay] { display: none !important; }',
      });

      await new Promise((r) => setTimeout(r, 1200));

      const file = path.join(OUTPUT_DIR, `login-390-${phase}.png`);
      await page.screenshot({ path: file });
      console.log(`✓ Saved ${file}`);
    }

    console.log('\nAll 8 deliverable screenshots captured cleanly!');
  } finally {
    await browser.close();
  }
}

captureAll().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
