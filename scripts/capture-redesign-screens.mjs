// scripts/capture-redesign-screens.mjs
// Real browser visual verification harness using Chrome & puppeteer-core
// Captures viewports: mobile (375x812), tablet (768x1024), desktop (1280x800)

import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer-core';
import { SignJWT } from 'jose';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve(process.cwd(), 'docs/redesign-screens');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate Auth Token
const envContent = fs.readFileSync('.env', 'utf8');
const secretMatch = envContent.match(/NEXTAUTH_SECRET=(.*)/);
const secret = secretMatch ? secretMatch[1].trim() : 'supersecretkeyshouldbeatleast32characterslong';

const token = await new SignJWT({
  userId: 'demo-user-1',
  email: 'demo@zyba.my.id',
  name: 'Aria Zen',
  role: 'USER',
  onboardingCompleted: true,
})
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('30d')
  .sign(new TextEncoder().encode(secret));

console.log('🔑 Auth Token generated successfully.');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812, isMobile: true },
  { name: 'tablet', width: 768, height: 1024, isMobile: false },
  { name: 'desktop', width: 1280, height: 800, isMobile: false },
];

const PAGES = [
  { id: 'landing', path: '/', auth: false },
  { id: 'login', path: '/login', auth: false },
  { id: 'welcome', path: '/welcome', auth: true },
  { id: 'assessment', path: '/assessment', auth: true },
  { id: 'dashboard', path: '/dashboard', auth: true },
  { id: 'mood-check-in', path: '/mood-check-in', auth: true },
  { id: 'companion', path: '/companion', auth: true },
  { id: 'activity', path: '/activity', auth: true },
  { id: 'wellness-journey', path: '/wellness-journey', auth: true },
  { id: 'community', path: '/community', auth: true },
  { id: 'resources', path: '/resources', auth: true },
  { id: 'achievements', path: '/achievements', auth: true },
  { id: 'settings', path: '/settings', auth: true },
  { id: 'zyba-plus', path: '/settings/zyba-plus', auth: true },
  { id: 'guidebook', path: '/guidebook', auth: false },
  { id: 'error-404', path: '/halaman-tidak-ada-404', auth: false },
];

async function run() {
  console.log(`🚀 Launching Chrome at: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const results = [];

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n📸 Starting viewport: ${vp.name.toUpperCase()} (${vp.width}x${vp.height})`);
      const context = await browser.createBrowserContext();
      const page = await context.newPage();
      await page.setViewport({
        width: vp.width,
        height: vp.height,
        isMobile: vp.isMobile,
        hasTouch: vp.isMobile,
      });

      // Set cookie for localhost
      if (token) {
        await page.setCookie({
          name: 'auth-token',
          value: token,
          domain: 'localhost',
          path: '/',
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
      }

      for (const p of PAGES) {
        const url = `${BASE_URL}${p.path}`;
        const filename = `${p.id}-${vp.name}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        process.stdout.write(`  [${vp.name}] Capturing ${p.id} (${p.path})... `);
        try {
          const res = await page.goto(url, {
            waitUntil: ['domcontentloaded', 'networkidle2'],
            timeout: 25000,
          });

          // Wait a brief moment for styles/fonts/animations to settle
          await new Promise((r) => setTimeout(r, 800));

          await page.screenshot({
            path: filepath,
            fullPage: false, // captures the primary viewport screen
          });

          const status = res ? res.status() : 'OK';
          console.log(`✓ OK (HTTP ${status}) -> ${filename}`);
          results.push({ page: p.id, viewport: vp.name, status: 'PASS', file: filename });
        } catch (err) {
          console.log(`✗ FAILED: ${err.message}`);
          results.push({ page: p.id, viewport: vp.name, status: 'FAIL', error: err.message });
        }
      }

      await page.close();
      await context.close();
    }
  } finally {
    await browser.close();
  }

  console.log('\n📊 SCREENSHOT HARNESS SUMMARY:');
  const total = results.length;
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = total - passed;
  console.log(`Total: ${total} | Passed: ${passed} | Failed: ${failed}`);

  // Write index JSON of screens
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'screens-manifest.json'),
    JSON.stringify(results, null, 2),
    'utf8'
  );
  console.log('Saved manifest to docs/redesign-screens/screens-manifest.json');
}

run().catch((err) => {
  console.error('Fatal error during screenshot capture:', err);
  process.exit(1);
});
