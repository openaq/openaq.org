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


  test('first featured case studies card navigates', async ({ page }) => {
    const featureCard = page.locator('div.cards > article.case-study-card:nth-child(1)')
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
  })
  
  test('second featured case studies card navigates', async ({ page }) => {
    const featureCard = page.locator('div.cards > article.case-study-card:nth-child(2)')
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
  })

  test('third featured case studies card navigates', async ({ page }) => {
    const featureCard = page.locator('div.cards > article.case-study-card:nth-child(3)')
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
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

  test('explore the data tab navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(2) > a')
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org');
  });

  test('why air quality tab navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(3) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/why-air-quality/`);
  });

  test('why open data tab navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(4) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/why-open-data/`);
  });

  test('partner tab navigates', async ({ page }) => {
    await page
      .locator('.header > nav > ul > li:nth-child(5) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/partners/`);
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

  test('about > news navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(2) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/about/news/`);
  });

  test('about > case studies navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(3) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/`);
  });

  test('about > technology navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(4) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/about/technology/`);
  });

  test('about > team navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(5) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/about/team/`);
  });

  test('about > reporting navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(6) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/about/reporting/`);
  });

  test('developers hover displays dropdown', async ({ page }) => {
    const developerSubmenu = await page.locator('.header > nav > ul > li:nth-child(6) > ul.submenu');
    await expect(developerSubmenu).toBeVisible({visible:false});
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await expect(developerSubmenu).toBeVisible();
  });

  test('developers > api overview navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(1) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/developers/api-overview/`);
  });

  test('developers > developer documentation navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(2) > a'
    ).click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('developers > case studies navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(3) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/`);
  });

  test('developers > help navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page.locator(
      '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(4) > a'
    ).click();
    await expect(page).toHaveURL(`${baseUrl}/developers/help/`);
  });
  
});

test.describe('footer navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('home tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(1)')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/`);
  });

  test('explore tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(2)')
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org/');
  });  

  test('partners tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(3)')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/partners/`);
  }); 

  test('api tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(4)')
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('about tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(5)')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('help tab navigates', async ({ page }) => {
    await page
      .locator('body > footer > div.footer__content > section.nav-section > nav > a:nth-child(6)')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/developers/help/`);
  });

  // insert subscribe test here

  

});