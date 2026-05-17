import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('PAGE ERROR:', err.toString());
  });

  await page.goto('http://localhost:5173/login');
  
  try {
    await page.fill('input[type="email"]', 'arpitkumar9619@gmail.com');
    await page.fill('input[type="password"]', 'Meandmyself@1');
    await page.click('button[type="submit"]');
  } catch(e) {
    // maybe already logged in
  }
  
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
