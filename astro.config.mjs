// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { remarkModifiedTime } from './remark-modified-time.mjs';

import purgecss from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  security: {
    csp: {
      directives: [
        "default-src 'none'",
        "font-src 'self'",
        "connect-src 'self' https://plausible.io https://medium.openaq.org https://api.github.com https://www.githubstatus.com blob:",
        "img-src 'self' https://widgets.guidestar.org/ data: blob: https://avatars.githubusercontent.com https://i.ytimg.com",
        'frame-src https://www.youtube.com/ https://www.youtube-nocookie.com/',
      ],
      scriptDirective: {
        resources: [
          "'self'",
          'https://plausible.io'
        ],
      },
      styleDirective: {
        resources: ["'self'"],
      },
    },
  },
  prefetch: true,
  output: 'static',
    markdown: {
    processor: unified({
      remarkPlugins: [remarkModifiedTime],
    }),
  },
  site: 'https://openaq.org',
  integrations: [purgecss()],
});
