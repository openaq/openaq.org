import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { test, expect } from '@playwright/test';

import { execSync } from 'child_process';
import path from 'path';

const sitemapUrl = 'http://localhost:4321/sitemap.xml';

interface SitemapUrl {
  loc: string[];
}

async function getSitemapUrls(): Promise<string[]> {
  const response = await axios.get<string>(sitemapUrl);
  const data = await parseStringPromise(response.data);

  const urls: SitemapUrl[] = data.urlset.url;
  return urls.map((urlObj) => urlObj.loc[0]);
}

async function checkUrl(url: string): Promise<number> {
  const response = await axios.get(url, {
    validateStatus: (status) => {
      return status >= 200 && status < 500;
    },
  });
  return response.status;
}

const urls = await getSitemapUrls();

for (const url of urls) {
  test(`test sitemap ${url} working`, async () => {
    const status = await checkUrl(url);
    expect(status).toBe(200);
  });
}

test(`sitemap entries count matches number of pages`, async () => {
  const root = path.dirname(path.basename(import.meta.dirname));
  const dist = path.resolve(root, 'dist');
  const count = execSync(`find "${dist}" -type f -name "index.html" | wc -l`);
  expect(urls.length).toBe(Number(count.toString()));
});
