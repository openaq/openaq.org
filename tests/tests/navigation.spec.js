// @ts-check
const { test, expect, request } = require('@playwright/test');

const baseUrl = 'http://localhost:1313';

test.describe('landing page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('learn more button navigates', async ({ page }) => {
    await page.locator('.learn-more-btn').click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });


  test('featured case studies card navigates', async ({ page }) => {
    const cards = await page.$$('.case-study-card');
    for (const card of cards) {
      const slug = await card.getAttribute('data-card-slug');
      await page.locator(`[data-card-slug=${slug}]`).click();
      await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}`);
    }

  })
  
  test('learn how openaq works button navigates', async ({ page }) => {
    await page.locator('body > main > section.technology-section > div.technology-section-blurb > div > a').click();
    await expect(page).toHaveURL(`${baseUrl}/developers/api-overview`);
  })

  test('explore the data button navigates', async ({ page }) => {
    await page.locator('body > main > section.search-section > div.search-section-blurb > div > a').click();
    await expect(page).toHaveURL('https://explore.openaq.org');
  })

  test('learn about openaq api button navigates', async ({ page }) => {
    await page.locator('body > main > section.search-section > div.search-section-blurb > div > a').click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  })

});

test.describe('header navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('home logo navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(1) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}`);
  });

  test('explore the data navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(2) > a')
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org');
  });

  test('about hover displays dropdown', async ({ page }) => {
    const aboutSubmenu = await page.locator('.header > nav > ul > li:nth-child(7) > ul.submenu');
    await expect(aboutSubmenu).toBeVisible({visible:false});
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await expect(aboutSubmenu).toBeVisible();
  });

  test('about > about openaq navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(1) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });
});
