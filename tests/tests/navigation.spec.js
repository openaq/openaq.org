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

  test('first featured case studies card navigates', async ({
    page,
  }) => {
    const featureCard = page.locator(
      'div.cards > article.case-study-card:nth-child(1)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
  });

  test('second featured case studies card navigates', async ({
    page,
  }) => {
    const featureCard = page.locator(
      'div.cards > article.case-study-card:nth-child(2)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
  });

  test('third featured case studies card navigates', async ({
    page,
  }) => {
    const featureCard = page.locator(
      'div.cards > article.case-study-card:nth-child(3)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/${slug}/`);
  });

  test('learn how openaq works button navigates', async ({
    page,
  }) => {
    await page
      .locator(
        'section.technology-section > div.technology-section-blurb > div > a'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/developers/api-overview/`
    );
  });

  test('explore the data button navigates', async ({ page }) => {
    await page
      .locator(
        'section.search-section > div.search-section-blurb > div > a'
      )
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org');
  });

  test('learn about openaq api button navigates', async ({
    page,
  }) => {
    await page
      .locator(
        'section.api-section > div.api-section-blurb > div > a'
      )
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('api chip navigates', async ({ page }) => {
    await page
      .locator(
        'section.case-studies-section > div > article:nth-child(1) > div > div > a.chip-base-data'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/api/`);
  });

  test('community chip navigates', async ({ page }) => {
    await page
      .locator(
        'section.case-studies-section > div > article:nth-child(1) > div > div > a.chip-base-interactive'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/case-studies/community/`
    );
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
    const submenu = page.locator(
      '.header > nav > ul > li:nth-child(7) > ul.submenu'
    );
    await expect(submenu).toBeVisible({ visible: false });
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await expect(submenu).toBeVisible();
  });

  test('about > about openaq navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(1) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('about > news navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(2) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/news/`);
  });

  test('about > case studies navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(3) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/`);
  });

  test('about > technology navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(4) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/technology/`);
  });

  test('about > people navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(5) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/people/`);
  });

  test('about > reporting navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(7) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(7) > ul > li:nth-child(6) > a'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/reporting/`);
  });

  test('developers hover displays dropdown', async ({ page }) => {
    const submenu = page.locator(
      '.header > nav > ul > li:nth-child(6) > ul.submenu'
    );
    await expect(submenu).toBeVisible({ visible: false });
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await expect(submenu).toBeVisible();
  });

  test('developers > api overview navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(1) > a'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/developers/api-overview/`
    );
  });

  test('developers > developer documentation navigates', async ({
    page,
  }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(2) > a'
      )
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('developers > case studies navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(3) > a'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/case-studies/developer/`
    );
  });

  test('developers > help navigates', async ({ page }) => {
    await page.hover('.header > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.header > nav > ul > li:nth-child(6) > ul > li:nth-child(4) > a'
      )
      .click();
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
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(1)'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/`);
  });

  test('explore tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(2)'
      )
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org/');
  });

  test('partners tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(3)'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/partners/`);
  });

  test('api tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(4)'
      )
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('about tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(5)'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('help tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.nav-section > nav > a:nth-child(6)'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/developers/help/`);
  });

  // insert subscribe test here

  test('fb icon navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.contact-section > div.social-links > a:nth-child(1)'
      )
      .click();
    await expect(page).toHaveURL('https://www.facebook.com/openaq/');
  });

  test('twitter icon navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.contact-section > div.social-links > a:nth-child(2)'
      )
      .click();
    await expect(page).toHaveURL('https://twitter.com/openaq');
  });

  test('linkedIn icon navigates', async ({ page }) => {
    await page
      .locator(
        '.footer > div.footer__content > section.contact-section > div.social-links > a:nth-child(3)'
      )
      .click();

    expect(page.url()).toContain(
      'https://www.linkedin.com/company/openaq'
    );
  });
});

test.describe('social banner navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/why-air-quality/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}/why-air-quality/`);
    expect(response.ok()).toBeTruthy();
  });

  test('github follow button navigates', async ({ page }) => {
    await page
      .locator(
        'section.social-banner > div.social-banner-content > div:nth-child(1) > div.social-section-description > a'
      )
      .click();
    await expect(page).toHaveURL('https://github.com/openaq');
  });

  test('twitter follow button navigates', async ({ page }) => {
    await page
      .locator(
        'section.social-banner > div.social-banner-content > div:nth-child(3) > div.social-section-description > a'
      )
      .click();
    await expect(page).toHaveURL('https://twitter.com/openaq');
  });

  test('slack join button navigates', async ({ page }) => {
    await page
      .locator(
        'section.social-banner > div.social-banner-content > div:nth-child(2) > div.social-section-description > a'
      )
      .click();
    await expect(page).toHaveURL(
      'https://openaq.slack.com/join/shared_invite/zt-yzqlgsva-v6McumTjy2BZnegIK9XCVw#/shared-invite/email'
    );
  });
});

test.describe('community banner navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/case-studies/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}/case-studies/`);
    expect(response.ok()).toBeTruthy();
  });

  test('participate button navigates', async ({ page }) => {
    const locator = page.locator(
      'section.community-banner > div.community-banner-content > div.community-participate > div.community-participate-description > a'
    );
    const href = await locator.getAttribute('href');
    expect(href).toBe('mailto:info@openaq.org');
  });

  test('support button navigates', async ({ page }) => {
    await page
      .locator(
        'section.community-banner > div.community-banner-content > div.community-support > div.community-support-description > a'
      )
      .click();
    await expect(page).toHaveURL(
      'https://secure.givelively.org/donate/openaq-inc/'
    );
  });
});

test.describe('about > people navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/about/people/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}/about/people/`);
    expect(response.ok()).toBeTruthy();
  });

  test('team member cards navigates', async ({ page }) => {
    const cards = page.locator('.team-card');
    const count = await cards.count();
    for (let i = 1; i < count; i++) {
      const teamCard = await page
      .locator(
        `body > main > div > div.team-content-container > section:nth-child(2) > article:nth-child(${i})`
        );
      const slug = await teamCard.getAttribute('data-team-slug');
      await page.locator(`[data-team-slug=${slug}]`).click();
      await expect(page).toHaveURL(`${baseUrl}/about/people/${slug}/`);
    }
  });
});

test.describe('bread crumb people navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/about/people/chris/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('people crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(5) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/people/`);
  });

  test('about crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(3) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('home icon crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(1) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}`);
  });
});

test.describe('bread crumb case-studies navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/case-studies/developer/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('case-studies crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(3) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/case-studies/`);
  });

  test('develeoper home icon crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(1) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}`);
  });
});

// end of tests