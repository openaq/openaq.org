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
      'body > main > section.use-cases-section > div > article:nth-child(1)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/${slug}/`);
  });

  test('second featured case studies card navigates', async ({
    page,
  }) => {
    const featureCard = page.locator(
      'body > main > section.use-cases-section > div > article:nth-child(2)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/${slug}/`);
  });

  test('third featured case studies card navigates', async ({
    page,
  }) => {
    const featureCard = page.locator(
      'body > main > section.use-cases-section > div > article:nth-child(3)'
    );
    const slug = await featureCard.getAttribute('data-card-slug');
    await page.locator(`[data-card-slug=${slug}]`).click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/${slug}/`);
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
        'section.use-cases-section > div > article:nth-child(1) > div > div > a.chip-base-data'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/api/`);
  });

  test('community chip navigates', async ({ page }) => {
    await page
      .locator(
        'section.use-cases-section > div > article:nth-child(1) > div > div > a.chip-base-interactive'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/use-cases/community/`
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
      .locator('.header-logo')
      .click();
    await expect(page).toHaveURL(`${baseUrl}`);
  });

  test('explore the data tab navigates', async ({ page }) => {
    await page
      .locator('.explore-data-tab')
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org');
  });

  test('why air quality tab navigates', async ({ page }) => {
    await page
      .locator('.air-quality-tab')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/why-air-quality/`);
  });

  test('why open data tab navigates', async ({ page }) => {
    await page
      .locator('.open-data-tab')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/why-open-data/`);
  });

  test('partners tab navigates', async ({ page }) => {
    await page
      .locator('.partners-tab')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/partners/`);
  });

// this needs work
  test('about hover displays dropdown', async ({ page }) => {
    const submenu = page.locator(
      'body > header > div > nav > ul > li:nth-child(6) > ul.submenu'
    );
    await expect(submenu).toBeVisible({ visible: false });
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await expect(submenu).toBeVisible();
  });

  test('about > about openaq navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.about-nav'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('about > initiatives navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.initiatives-nav'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/initiatives/`);
  });

  test('about > use-cases navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.use-cases-nav'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/`);
  });

  test('about > people navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.people-nav'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/people/`);
  });

  test('about > reporting navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(6) > a');
    await page
      .locator(
        '.reporting-nav'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/reporting/`);
  });

  test('developers hover displays dropdown', async ({ page }) => {
    const submenu = page.locator(
      'body > header > div > nav > ul > li:nth-child(5) > ul.submenu'
    );
    await expect(submenu).toBeVisible({ visible: false });
    await page.hover('body > header > div > nav > ul > li:nth-child(5) > a');
    await expect(submenu).toBeVisible();
  });

  test('developers > api overview navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(5) > a');
    await page
      .locator(
        '.api-overview-nav'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/developers/api-overview/`
    );
  });

  test('developers > developer documentation navigates', async ({
    page,
  }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(5) > a');
    await page
      .locator(
        '.documentation-nav'
      )
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('developers > use-cases navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(5) > a');
    await page
      .locator(
        '.dev-use-case-nav'
      )
      .click();
    await expect(page).toHaveURL(
      `${baseUrl}/use-cases/developer/`
    );
  });

  test('developers > help navigates', async ({ page }) => {
    await page.hover('body > header > div > nav > ul > li:nth-child(5) > a');
    await page
      .locator(
        '.help-nav'
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
        '.footer-home'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/`);
  });

  test('explore tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-explore'
      )
      .click();
    await expect(page).toHaveURL('https://explore.openaq.org/');
  });

  test('partners tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-partners'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/partners/`);
  });

  test('api tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-api'
      )
      .click();
    await expect(page).toHaveURL('https://docs.openaq.org/docs');
  });

  test('about tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-about'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/about/`);
  });

  test('contact tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-contact'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/contact/`);
  });

  test('help tab navigates', async ({ page }) => {
    await page
      .locator(
        '.footer-help'
      )
      .click();
    await expect(page).toHaveURL(`${baseUrl}/developers/help/`);
  });

  // insert subscribe test here

  // footer social links

  test('slack icon navigates', async ({ page }) => {
    await page
      .locator(
        '.slack-nav'
      )
      .click();
    await expect(page).toHaveURL('https://openaq.slack.com/join/shared_invite/zt-yzqlgsva-v6McumTjy2BZnegIK9XCVw#/shared-invite/email');
  });

  test('fb icon navigates', async ({ page }) => {
    await page
      .locator(
        '.fb-nav'
      )
      .click();
    await expect(page).toHaveURL('https://www.facebook.com/openaq/');
  });

  test('youtube icon navigates', async ({ page }) => {
    await page
      .locator(
        '.youtube-nav'
      )
      .click();
    await expect(page).toHaveURL('https://www.youtube.com/@openaq4768');
  });

  test('twitter icon navigates', async ({ page }) => {
    await page
      .locator(
        '.twitter-nav'
      )
      .click();
    await expect(page).toHaveURL('https://twitter.com/openaq');
  });

  test('medium icon navigates', async ({ page }) => {
    await page
      .locator(
        '.medium-nav'
      )
      .click();
    await expect(page).toHaveURL('https://openaq.medium.com/');
  });

  test('github icon navigates', async ({ page }) => {
    await page
      .locator(
        '.github-nav'
      )
      .click();
    await expect(page).toHaveURL('https://github.com/openaq');
  });

  test('linkedIn icon navigates', async ({ page }) => {
    await page
      .locator(
        '.linkedIn-nav'
      )
      .click();

    expect(page.url()).toContain(
      'https://www.linkedin.com/company/openaq'
    );
  });
});

///
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
        '.social-banner-gh'
      )
      .click();
    await expect(page).toHaveURL('https://github.com/openaq');
  });

  test('twitter follow button navigates', async ({ page }) => {
    await page
      .locator(
        '.social-banner-twitter'
      )
      .click();
    await expect(page).toHaveURL('https://twitter.com/openaq');
  });

  test('slack join button navigates', async ({ page }) => {
    await page
      .locator(
        '.social-banner-slack'
      )
      .click();
    await expect(page).toHaveURL(
      'https://openaq.slack.com/join/shared_invite/zt-yzqlgsva-v6McumTjy2BZnegIK9XCVw#/shared-invite/email'
    );
  });
});

test.describe('community banner navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/use-cases/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}/use-cases/`);
    expect(response.ok()).toBeTruthy();
  });

  test('participate button navigates', async ({ page }) => {
    const locator = page.locator(
      '.community-banner-participate'
    );
    const href = await locator.getAttribute('href');
    expect(href).toBe('mailto:info@openaq.org');
  });

  test('support button navigates', async ({ page }) => {
    await page
      .locator(
        '.community-banner-support'
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
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('team member cards navigates', async ({ page }) => {
    const cards = page.locator('.team-card');
    const count = await cards.count();
    for (let i = 1; i < count; i++) {
      await page.goto(`${baseUrl}/about/people/`);
      const teamCard = page
        .locator(
          `body > main > div > div.team-content-container > section:nth-child(2) > article:nth-child(${i})`
        );
      let slug = await teamCard.getAttribute('data-testid');
      await page.getByTestId(`${slug}`).getByRole('link').first().click();
      await expect(page).toHaveURL(`${baseUrl}/about/people/${slug}/`);
    }
  });
});

test.describe('bread crumb people navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/about/people/chris_hagerbaumer/`);
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

test.describe('bread crumb use-cases navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${baseUrl}/use-cases/developer/`);
  });

  test('page responds HTTP 200', async () => {
    const context = await request.newContext();
    const response = await context.get(`${baseUrl}`);
    expect(response.ok()).toBeTruthy();
  });

  test('use-cases crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(3) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}/use-cases/`);
  });

  test('developer home icon crumb navigates', async ({ page }) => {
    await page
      .locator('body > main > ol > li:nth-child(1) > a')
      .click();
    await expect(page).toHaveURL(`${baseUrl}`);
  });
  
});

// end of tests