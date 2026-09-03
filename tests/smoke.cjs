const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  const url = `file:///${path.resolve('index.html').replace(/\\/g, '/')}`;
  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  if (!(await page.locator('#dashboardView').isVisible())) throw new Error('Dashboard is not visible');
  if (!(await page.locator('.sidebar .brand b').textContent()).includes('猫猫六级')) throw new Error('Brand name was not updated');
  if ((await page.locator('.side-cat-card').count()) !== 0) throw new Error('Sidebar cat card was not removed');
  const dailyBackgrounds = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-content');
    return {
      sidebarImage: getComputedStyle(sidebar).backgroundImage,
      mainImage: getComputedStyle(main).backgroundImage,
      mainIndex: main.dataset.dailyBackgroundIndex,
      mainOverlay: getComputedStyle(main, '::before').content
    };
  });
  if (dailyBackgrounds.sidebarImage !== 'none') throw new Error('Sidebar background image was not removed');
  if (!dailyBackgrounds.mainImage.includes('main-bg-') || dailyBackgrounds.mainIndex === undefined) throw new Error('Main daily background did not load');
  if (dailyBackgrounds.mainOverlay !== 'none') throw new Error('Unexpected background overlay is still present');
  if (Number(await page.locator('#libraryCount').textContent()) < 3900) throw new Error('Full vocabulary did not load');
  if ((await page.locator('#wordList .library-word').count()) !== 60) throw new Error('Vocabulary pagination failed');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve('tests', 'desktop-dashboard.png'), fullPage: true });
  await page.locator('#startStudyBtn').click();
  if (!(await page.locator('#wordCard').isVisible())) throw new Error('Study card did not open');
  const studyOverlay = await page.locator('.main-content').evaluate(main => ({
    enabled: main.classList.contains('study-mode'),
    content: getComputedStyle(main, '::before').content,
    background: getComputedStyle(main, '::before').backgroundColor
  }));
  if (!studyOverlay.enabled || studyOverlay.content === 'none' || studyOverlay.background === 'rgba(0, 0, 0, 0)') throw new Error('Study-only overlay did not activate');
  const companion = await page.locator('#studyCompanion').evaluate(image => ({
    src: image.getAttribute('src'),
    loaded: image.complete && image.naturalWidth > 0,
    animation: getComputedStyle(image).animationName,
    borderRadius: getComputedStyle(image).borderRadius,
    dailyIndex: image.dataset.dailyIndex
  }));
  if (!companion.loaded || !companion.src || companion.dailyIndex === undefined) throw new Error('Daily companion did not load');
  if (companion.animation !== 'companionWiggle') throw new Error('Companion head animation is missing');
  if (companion.borderRadius !== '50%') throw new Error('Companion circular background is missing');
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.resolve('tests', 'study-companion.png'), fullPage: true });
  if ((await page.locator('#wordText').textContent()) !== 'abandon') throw new Error('First word is incorrect');
  await page.locator('#revealBtn').click();
  if (!(await page.locator('#answerPanel').isVisible())) throw new Error('Answer did not reveal');
  const ratingLayout = await page.locator('#ratingPanel').evaluate(panel => {
    const box = panel.getBoundingClientRect();
    return {bottom: box.bottom, viewportHeight: innerHeight, scrollY};
  });
  if (ratingLayout.bottom > ratingLayout.viewportHeight || ratingLayout.scrollY !== 0) throw new Error('Rating buttons require page scrolling');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.resolve('tests', 'rating-buttons-visible.png'), fullPage: false });
  await page.locator('[data-rating="again"]').click();
  await page.waitForTimeout(500);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('meow-cet6-state-v1')));
  if (!saved?.progress?.abandon || saved.totalReviews !== 1) throw new Error('Progress was not persisted');
  if (saved.progress.abandon.due > Date.now() || saved.activity[Object.keys(saved.activity)[0]].count !== 0) throw new Error('Forgotten word was incorrectly marked complete');
  if ((await page.locator('#sessionCounter').textContent()).replace(/\s/g, '') !== '2/11') throw new Error('Forgotten word was not requeued in this session');

  await page.locator('[data-go="dashboard"]').first().click();
  if (await page.locator('.main-content').evaluate(main => main.classList.contains('study-mode'))) throw new Error('Study overlay remained on dashboard');
  if (Number(await page.locator('#dueCount').textContent()) < 1) throw new Error('Forgotten word is not due for review');
  await page.locator('.nav-item[data-view="library"]').click();
  await page.locator('#wordSearch').fill('profound');
  if ((await page.locator('#wordList .library-word').count()) !== 1) throw new Error('Chinese search failed');
  if (!(await page.locator('#wordList .library-word h3').textContent()).trim().startsWith('profound')) throw new Error('Search returned wrong word');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#mobileMenuBtn').click();
  if (!(await page.locator('.sidebar').evaluate(el => el.classList.contains('open')))) throw new Error('Mobile menu failed');
  await page.screenshot({ path: path.resolve('tests', 'mobile-smoke.png'), fullPage: true });
  if (errors.length) throw new Error(`Browser errors: ${errors.join(' | ')}`);
  await browser.close();
  console.log('Smoke test passed: dashboard, study flow, persistence, search, and mobile menu.');
})().catch(error => { console.error(error); process.exit(1); });
