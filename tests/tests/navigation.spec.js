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
