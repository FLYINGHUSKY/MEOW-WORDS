const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  const errors = [];
  const user = {id: '11111111-1111-4111-8111-111111111111', user_metadata: {username: '测试猫'}};
  let uploadedProgress = null;

  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  await page.route('**/supabase-config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: `window.MEOW_AUTH_CONFIG={supabaseUrl:'https://auth-smoke.supabase.co',supabasePublishableKey:'sb_publishable_test',usernameDomain:'users.meowwords.app'};`
  }));

  await page.route('https://auth-smoke.supabase.co/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname === '/auth/v1/signup') {
      await route.fulfill({status: 200, contentType: 'application/json', body: JSON.stringify({access_token: 'test-access-token', refresh_token: 'test-refresh-token', expires_in: 3600, user})});
      return;
    }
    if (url.pathname === '/rest/v1/user_progress' && request.method() === 'GET') {
      await route.fulfill({status: 200, contentType: 'application/json', body: '[]'});
      return;
    }
    if (url.pathname === '/rest/v1/user_progress' && request.method() === 'POST') {
      uploadedProgress = request.postDataJSON();
      await route.fulfill({status: 201, contentType: 'application/json', body: ''});
      return;
    }
    if (url.pathname === '/auth/v1/logout') {
      await route.fulfill({status: 204, body: ''});
      return;
    }
    await route.fulfill({status: 404, contentType: 'application/json', body: JSON.stringify({message: 'Unhandled mock request'})});
  });

  const url = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;
  await page.goto(url, {waitUntil: 'load'});
  await page.evaluate(() => localStorage.clear());
  await page.reload({waitUntil: 'load'});

  await page.locator('#authButton').click();
  if (!(await page.locator('#authForm').isVisible()) || await page.locator('#authSetup').isVisible()) throw new Error('Configured registration form did not open');
  await page.locator('[data-auth-mode="register"]').click();
  await page.locator('#authUsername').fill('测试猫');
  await page.locator('#authPassword').fill('cat-password-2026');
  await page.locator('#authPasswordConfirm').fill('cat-password-2026');
  await page.locator('#authSubmitBtn').click();
  await page.locator('#accountPanel').waitFor({state: 'visible'});

  if ((await page.locator('#profileName').textContent()).trim() !== '测试猫') throw new Error('Registered username was not displayed');
  if ((await page.evaluate(() => window.MeowApp.getScope())) !== user.id) throw new Error('Account storage scope was not activated');
  if (!uploadedProgress || uploadedProgress.user_id !== user.id || !uploadedProgress.state) throw new Error('Learning progress was not uploaded');

  await page.screenshot({path: path.resolve('tests', 'auth-account.png'), fullPage: false});
  await page.locator('#logoutBtn').click();
  await page.waitForTimeout(100);
  if ((await page.locator('#profileName').textContent()).trim() !== '游客同学') throw new Error('Logout did not restore guest mode');
  if ((await page.evaluate(() => window.MeowApp.getScope())) !== 'guest') throw new Error('Logout did not restore guest storage');
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);

  await browser.close();
  console.log('Auth smoke test passed: register, migrate, sync, and logout.');
})().catch(error => { console.error(error); process.exit(1); });
