import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const contact = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/contact" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const sponsors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/sponsor" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const policies = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/policies" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const funders = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/partners/funders" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const corporate = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/partners/corporate" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const airsensors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/partners/airsensors" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/partners/partners" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const initiatives = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/initiatives" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
    }),
});

const staff = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/staff" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      email: z.string().email(),
      image: image(),
      bluesky: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      mastadon: z.string().url().optional(),
      orcid: z.string().url().optional(),
      researchGate: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
    }),
});

const board = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/board" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      email: z.string().email(),
      image: image(),
      bluesky: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      mastadon: z.string().url().optional(),
      orcid: z.string().url().optional(),
      researchGate: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
    }),
});

const advisors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/advisors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      country: z.string(),
      email: z.string().email().optional(),
      image: image(),
      bluesky: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      mastadon: z.string().url().optional(),
      orcid: z.string().url().optional(),
      researchGate: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
    }),
});

const ambassadors = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/ambassadors" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      position: z.string(),
      country: z.string(),
      email: z.string().email().optional(),
      image: image(),
      bluesky: z.string().url().optional(),
      linkedin: z.string().url().optional(),
      github: z.string().url().optional(),
      x: z.string().url().optional(),
      mastadon: z.string().url().optional(),
      orcid: z.string().url().optional(),
      researchGate: z.string().url().optional(),
      googleScholar: z.string().url().optional(),
    }),
});

const usecases = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/use-cases/" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      url: z.string(),
      tags: z.array(z.string()),
      categories: z.array(z.string()).optional(),
      image: image(),
      featured: z.boolean(),
    }),
});

const help = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/developers/help" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const about = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/about" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const developers = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/developers/singleDevPages",
  }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const peopleIndex = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/people/peopleIndex" }),
  schema: () =>
    z.object({
      staffIntro: z.string(),
      advisorIntro: z.string(),
      boardIntro: z.string(),
      ambassadorIntro: z.string(),
    }),
});

const partnersIndex = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/partners/partnersIndex",
  }),
  schema: () =>
    z.object({
      title: z.string(),
      airsensorsTitle: z.string(),
      fundersTitle: z.string(),
      corporateTitle: z.string(),
      partnersTitle: z.string(),
    }),
});

const helpIndex = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/developers/helpIndex" }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const legal = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/legal" }),
  schema: () =>
    z.object({
      title: z.string(),
      financialTitle: z.string(),
      financialDescription: z.string(),
      bylawsTitle: z.string(),
      bylawsDescription: z.string(),
      incorporationTitle: z.string(),
      incorporationDescription: z.string(),
      policiesTitle: z.string(),
      policiesDescription: z.string(),
    }),
});

const homepage = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/index.md" }),
  schema: () =>
    z.object({
      title: z.string(),
      heroTitle: z.string(),
      heroTitleLavender: z.string(),
      heroDescription: z.string(),
      technologyCardTitle: z.string(),
      technologlyCardDescription: z.string(),
      searchCardTitle: z.string(),
      searchCardDescription: z.string(),
      aqiHubCardTitle: z.string(),
      aqiHubCardDescription: z.string(),
      apiCardTitle: z.string(),
      apiCardDescription: z.string(),
    }),
});

const initiativesIndex = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/initiatives/initiativesIndex/",
  }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const usecaseIndex = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/use-cases/use-casesIndex/",
  }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const whyOpenData = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/why-open-data/",
  }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

const whyAirQuality = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/why-air-quality/",
  }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

export const collections = {
  sponsors,
  policies,
  funders,
  airsensors,
  partners,
  corporate,
  initiatives,
  staff,
  board,
  advisors,
  ambassadors,
  usecases,
  help,
  about,
  peopleIndex,
  developers,
  legal,
  homepage,
  initiativesIndex,
  usecaseIndex,
  whyAirQuality,
  whyOpenData,
  helpIndex,
  partnersIndex,
  contact,
};
