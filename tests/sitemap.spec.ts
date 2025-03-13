import axios from "axios";
import { parseStringPromise } from "xml2js";
import { test, expect } from "@playwright/test";

const sitemapUrl = "http://localhost:4321/sitemap.xml";

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
  try {
    const response = await axios.get(url);

    console.log(`${url} - ${response.status}`);
    return response.status;
  } catch (error) {
    console.error(`Failed to fetch ${url}`, error);
    return 404;
  }
}
test("test sitemap url working", async () => {
  const urls = await getSitemapUrls();
  const results = await Promise.all(
    urls.map(async (url) => {
      const status = await checkUrl(url);
      return { url, status };
    })
  );

  const failedUrls = results.filter((result) => result.status !== 200);
  const successfulUrls = results.filter((result) => result.status === 200);

  if (successfulUrls.length > 0) {
    console.log("The urls that works", successfulUrls);
  }
  if (failedUrls.length > 0) {
    console.log("The urls that has been failing", failedUrls);
  }

  expect(failedUrls).toEqual([]);
});
