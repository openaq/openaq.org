import { OGImageRoute } from "astro-og-canvas";
import { getCollection } from "astro:content";

const staff = await getCollection("staff");
const initiatives = await getCollection("initiatives");
const policies = await getCollection("policies");
const useCases = await getCollection("useCases");
const about = await getCollection("about");
const peopleIndex = await getCollection("peopleIndex");
const initiativesIndex = await getCollection("initiativesIndex");
const usecaseIndex = await getCollection("usecaseIndex");
const whyOpenData = await getCollection("whyOpenData");
const whyAirQuality = await getCollection("whyAirQuality");
const homepage = await getCollection("homepage");
const legal = await getCollection("legal");
const partnersindex = await getCollection("partnersIndex");
const platform = await getCollection("platform");
const sponsors = await getCollection("sponsors");
const contact = await getCollection("contact");

const homepageContent = homepage.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "OpenAQ - environmental tech nonprofit.",
  };
});

const aboutContent = about.map((about) => {
  return {
    id: about.id,
    title: about.data.title,
    description:
      "OpenAQ is an environmental tech nonprofit that is providing universal access to air quality data.",
  };
});

const peopleIndexContent = peopleIndex.map((index) => {
  return {
    id: index.id,
    title: index.data.title,
    description: index.data.title,
  };
});

const staffContent = staff.map((person) => {
  return {
    id: person.id,
    title: person.data.name,
    description: `${person.data.name} - ${person.data.position}`,
  };
});

const usecaseIndexContent = usecaseIndex.map((index) => {
  return {
    id: index.id,
    title: index.data.title,
    description: `Explore OpenAQ's ${index.data.title}`,
  };
});

const useCasesContent = useCases.map((usecase) => {
  return {
    id: usecase.id,
    title: usecase.data.title,
    description: `Explore the OpenAQ usecase: "${usecase.data.title}"`,
  };
});

const initiativesIndexContent = initiativesIndex.map((index) => {
  return {
    id: index.id,
    title: index.data.title,
    description: `Explore OpenAQ's "${index.data.title}"`,
  };
});

const initiativesContent = initiatives.map((initiative) => {
  return {
    id: initiative.id,
    title: initiative.data.title,
    description: `Explore the OpenAQ intitiative: "${initiative.data.title}"`,
  };
});

const partnersIndexContent = partnersindex.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "Explore the partners of OpenAQ",
  };
});

const platformContent = platform.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "Read more about the OpenAQ platform",
  };
});

const sponsorContent = sponsors.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "Explore how you can sponsor OpenAQ",
  };
});

const policiesContent = policies.map((policy) => {
  return {
    id: policy.id,
    title: policy.data.title,
    description: `Read about OpenAQ's ${policy.data.title}`,
  };
});

const legalContent = legal.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "Read and download Legal and Policy documents of OpenAQ",
  };
});

const whyOpenDataContent = whyOpenData.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description:
      "This page summarizes the benefits of open data from OpenAQ point of view",
  };
});

const whyOpenAirContent = whyAirQuality.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description:
      "This page summarizes why it is important to focus on air quality”",
  };
});

const contactContent = contact.map((page) => {
  return {
    id: page.id,
    title: page.data.title,
    description: "Contact information to OpenAQ",
  };
});

const allCollections = [
  ...staffContent,
  ...initiativesContent,
  ...useCasesContent,
  ...policiesContent,
  ...contactContent,
  ...whyOpenAirContent,
  ...whyOpenDataContent,
  ...legalContent,
  ...sponsorContent,
  ...platformContent,
  ...initiativesIndexContent,
  ...homepageContent,
  ...aboutContent,
  ...peopleIndexContent,
  ...partnersIndexContent,
  ...usecaseIndexContent,
];

const pages = Object.fromEntries(
  allCollections.map(({ id, title, description }) => [
    id,
    { title, description },
  ])
);

export const { getStaticPaths, GET } = await OGImageRoute({
  pages,
  param: "slug",
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: `OpenAQ`,
      description: page.description,
      bgGradient: [
        [51, 163, 161],
        [203, 232, 202],
      ],
      logo: {
        path: "./src/assets/logo.svg",
      },
      border: { color: [51, 163, 161], width: 40 },
      padding: 40,
    };
  },
});
