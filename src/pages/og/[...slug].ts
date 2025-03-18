import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

const staff = await getCollection("staff");
const ambassadors = await getCollection("ambassadors");
const initiatives = await getCollection("initiatives");
const policies = await getCollection("policies");
const usecases = await getCollection("usecases");

const staffContent = staff.map((person) => {
  return {
    id: person.id,
    title: person.data.title,
    description: `${person.data.title} - ${person.data.position}`,
  };
});

const ambassadorsContent = ambassadors.map((person) => {
  return {
    id: person.id,
    title: person.data.title,
    description: `${person.data.title} - ${person.data.position}`,
  };
});

const usecasesContent = usecases.map((usecase) => {
  return {
    id: usecase.id,
    title: usecase.data.title,
    description: `Explore the OpenAQ usecase: "${usecase.data.title}"`,
  };
});

const policiesContent = policies.map((policy) => {
  return {
    id: policy.id,
    title: policy.data.title,
    description: `Read about OpenAQ's ${policy.data.title}`,
  };
});

const initiativesContent = initiatives.map((initiative) => {
  return {
    id: initiative.id,
    title: initiative.data.title,
    description: `Explore the OpenAQ intitiative: "${initiative.data.title}"`,
  };
});

const allCollections = [
  ...staffContent,
  ...ambassadorsContent,
  ...initiativesContent,
  ...usecasesContent,
  ...policiesContent,
];

const pages = Object.fromEntries(
  allCollections.map(({ id, title, description }) => [
    id,
    { title, description },
  ])
);

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: `OpenAQ`,
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
