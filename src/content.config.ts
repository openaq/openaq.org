import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const initiatives = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/initiatives' }),
  schema: z.object({
    title: z.string(),
  }),
});

const staff = defineCollection({
  loader: glob({ pattern: ['*.md'], base: 'src/data/people/staff' }),
  schema:  ({ image }) => z.object({
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
    researchGate: z.string().url().optional() ,
    googleScholar: z.string().url().optional() ,
})
});

export const collections = { initiatives, staff };
