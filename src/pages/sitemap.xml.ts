import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { render } from 'astro:content';

const COLLECTION_ROUTES = {
  staff:                  ['about', 'people'],
  initiatives:            ['about', 'initiatives'],
  policies:               [],
  useCases:               ['about', 'use-cases'],
  whyAirQuality:          [],
  whyOpenData:            [],
  about:                  [],
  peopleIndex:            ['about'],
  airsensors:             ['partners', 'airsensors'],
  networkPartners:        ['partners', 'networkPartners'],
  organizationalPartners: ['partners', 'organizationalPartners'],
  usecaseIndex:           ['about'],
  initiativesIndex:       ['about'],
  homepage:               [],
  legal:                  ['about'],
  platform:               ['platform'],
  partnersIndex:          [],
  sponsors:               ['about'],
  contact:                [],
} as const;

type CollectionName = keyof typeof COLLECTION_ROUTES;

export async function GET() {
  const siteUrl = import.meta.env.SITE;

  const collections = Object.fromEntries(
    await Promise.all(
      Object.keys(COLLECTION_ROUTES).map(async (name) => [
        name,
        await getCollection(name as CollectionName),
      ])
    )
  ) as Record<CollectionName, CollectionEntry<CollectionName>[]>;

  const entryMap = async (entry: CollectionEntry<CollectionName>) => {
    const { remarkPluginFrontmatter } = await render(entry);
    const { collection, id } = entry;
    return {
      slug: id,
      lastModified: remarkPluginFrontmatter.lastModified as string,
      route: [...COLLECTION_ROUTES[collection]],
    };
  };

  const allEntries = await Promise.all(
    Object.values(collections).flatMap((entries) => entries.map(entryMap))
  );

  const buildUrlEntry = ({
    lastModified,
    slug,
    route,
  }: {
    lastModified: string;
    slug: string;
    route: string[];
  }) => {
    const url = new URL([...route, slug].join('/'), siteUrl);
    const lastmod = lastModified
      ? new Date(lastModified).toISOString()
      : 'No latest modified date found';

    return `<url>
    <loc>${url.href}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  };

  const result = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}</loc></url>
  ${allEntries.map(buildUrlEntry).join('\n  ')}
</urlset>`.trim();

  return new Response(result, {
    headers: { 'Content-Type': 'application/xml' },
  });
}