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

// async function checkUrls(urls: any) {
//   return await Promise.all(
//     urls.map(async (url: string) => {
//       try {
//         const response = await axios.get(url);
//         console.log(`${url} - ${response.status}`);
//         return { url, status: response.status };
//       } catch (error) {
//         console.error(`${url} - Failed`, error);
//         return { url, status: "Failed" };
//       }
//     })
//   );
// }

async function checkUrl(url: string): Promise<number> {
  const response = await axios.get(url);
  console.error(`Failed to fetch ${url}:`, Error);
  console.log(`${url} - ${response.status}`);
  return response.status;
}
test("test sitemap url working", async () => {
  const urls = await getSitemapUrls();
  await Promise.all(
    urls.map(async (url) => {
      const status = await checkUrl(url);
      expect(status).toBe(200);
    })
  );
});
