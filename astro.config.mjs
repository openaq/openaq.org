// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";

import purgecss from "astro-purgecss";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  output: "static",

  experimental: {
    svg: true,
  },

  markdown: {
    remarkPlugins: [remarkModifiedTime],
  },

  site: "https://openaq.org/",

  integrations: [purgecss(), sitemap()],
});
