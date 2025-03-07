// @ts-check
import { defineConfig } from "astro/config";
import { remarkModifiedTime } from "./remark-modified-time.mjs";

import purgecss from "astro-purgecss";

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

  integrations: [purgecss()],
});
