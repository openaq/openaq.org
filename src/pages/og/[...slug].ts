import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const staff = await getCollection("staff");
const ambassadors = await getCollection("ambassadors");
const initiatives = await getCollection("initiatives");
const policies = await getCollection("policies");
const usecases = await getCollection("usecases");

const allCollections = [
  ...staff,
  ...ambassadors,
  ...initiatives,
  ...policies,
  ...usecases,
];

const pages = Object.fromEntries(
  allCollections.map(({ id, data }) => [
    id,
    { title: data.title, description: "Testing" },
  ])
);

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: `OpenAQ-${page.title}`,
      description: page.description,
      bgGradient: [
        [106, 92, 216],
        [227, 224, 251],
      ],
      logo: {
        path: "./src/assets/logo.svg",
      },
      border: { color: [106, 92, 216], width: 20 },
      padding: 40,
    };
  },
});
