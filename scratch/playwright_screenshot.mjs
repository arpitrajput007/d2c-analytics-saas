import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER LOG:', msg.text());
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  await page.goto('http://localhost:5173/login');
  
  try {
    await page.fill('input[type="email"]', 'arpitkumar9619@gmail.com');
    await page.fill('input[type="password"]', 'Meandmyself@123');
    await page.click('button[type="submit"]');
  } catch(e) {}
  
  await page.waitForTimeout(5000); // wait for dashboard to load
  await page.screenshot({ path: 'scratch/dashboard.png' });
  console.log('Screenshot saved to scratch/dashboard.png');
  
  await browser.close();
})();
