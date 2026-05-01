// @ts-check
import { defineConfig } from 'astro/config';
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
        "img-src 'self' https://widgets.guidestar.org/ data: blob: https://avatars.githubusercontent.com",
        'frame-src https://www.youtube.com/',
      ],
      scriptDirective: {
        resources: [
          "'self'",
          'https://plausible.io',
          'https://identity.netlify.com/v1/netlify-identity-widget.js',
          'https://unpkg.com/decap-cms@%5E3.0.0/dist/decap-cms.js',
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
    remarkPlugins: [remarkModifiedTime],
  },
  site: 'https://openaq.org',
  integrations: [purgecss()],
});
