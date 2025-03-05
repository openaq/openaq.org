import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const entries = await getCollection("advisors");

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: `OpenAQ-${page.data.title}`,
      description: page.data.position,
      bgGradient: [
        [30, 100, 171],
        [106, 92, 216],
      ],
      logo: {
        path: "@assets/svg/logo.svg",
        size: [200],
      },
      border: { color: [63, 194, 192], width: 20 },
      padding: 40,
    };
  },
});
