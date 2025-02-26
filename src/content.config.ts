import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';


const cookies = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/cookies' }),
  schema: () =>
    z.object({
    }),
})

const funders = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/partners/funders' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const corporate = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/partners/corporate' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const airsensors = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/partners/airsensors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const partners = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/partners/partners' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
      url: z.string().url(),
    }),
});

const initiatives = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/initiatives' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      image: image(),
    }),
});

const staff = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/people/staff' }),
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
  loader: glob({ pattern: ['*.md'], base: 'src/data/people/board' }),
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
  loader: glob({ pattern: ['*.md'], base: 'src/data/people/advisors' }),
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
  loader: glob({ pattern: ['*.md'], base: 'src/data/people/ambassadors' }),
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

export const collections = {
  cookies,
  funders,
  airsensors,
  partners,
  corporate,
  initiatives,
  staff,
  board,
  advisors,
  ambassadors,
};
