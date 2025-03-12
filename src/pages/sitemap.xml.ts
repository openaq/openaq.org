import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import { render } from "astro:content";

export async function GET() {
  const siteUrl = import.meta.env.SITE;

  const staff = await getCollection("staff");
  const ambassadors = await getCollection("ambassadors");
  const initiatives = await getCollection("initiatives");
  const policies = await getCollection("policies");
  const usecases = await getCollection("usecases");
  const help = await getCollection("help");
  const about = await getCollection("about");
  const peopleIndex = await getCollection("peopleIndex");
  const partners = await getCollection("partners");
  const airsensors = await getCollection("airsensors");
  const funders = await getCollection("funders");
  const corporate = await getCollection("corporate");
  const initiativesIndex = await getCollection("initiativesIndex");
  const usecaseIndex = await getCollection("usecaseIndex");
  const whyOpenData = await getCollection("whyOpenData");
  const whyAirQuality = await getCollection("whyAirQuality");

  type CollectionName =
    | "staff"
    | "ambassadors"
    | "initiatives"
    | "policies"
    | "usecases"
    | "help"
    | "about"
    | "peopleIndex"
    | "partners"
    | "airsensors"
    | "funders"
    | "corporate"
    | "initiativesIndex"
    | "usecaseIndex"
    | "whyOpenData"
    | "whyAirQuality";

  const routes = {
    staff: ["about", "people"],
    ambassadors: ["about", "people"],
    initiatives: ["about", "initiatives"],
    policies: [],
    usecases: ["about", "use-cases"],
    help: ["developers", "help"],
    whyAirQuality: [],
    whyOpenData: [],
    about: [],
    peopleIndex: ["about"],
    partners: ["partners"],
    airsensors: ["partners", "airsensors"],
    corporate: ["partners"],
    funders: ["partners"],
    usecaseIndex: ["about"],
    initiativesIndex: ["about"],
  };

  const getRoute = (collection: CollectionName): string[] => {
    return routes[collection];
  };

  const entryMap = async (entry: CollectionEntry<CollectionName>) => {
    const { remarkPluginFrontmatter } = await render(entry);
    const { collection, id } = entry;
    const { lastModified } = remarkPluginFrontmatter;
    return {
      slug: id,
      lastModified,
      route: getRoute(collection),
    };
  };

  const helpEntries = await Promise.all(help.map(entryMap));
  const staffEntries = await Promise.all(staff.map(entryMap));
  const ambassadorEntries = await Promise.all(ambassadors.map(entryMap));
  const aboutEntries = await Promise.all(about.map(entryMap));
  const partnerEntries = await Promise.all(partners.map(entryMap));
  const airsensorEntries = await Promise.all(airsensors.map(entryMap));
  const funderEntries = await Promise.all(funders.map(entryMap));
  const corporateEntries = await Promise.all(corporate.map(entryMap));
  const initiativeEntries = await Promise.all(initiatives.map(entryMap));
  const policiesEntries = await Promise.all(policies.map(entryMap));
  const peopleIndexEntries = await Promise.all(peopleIndex.map(entryMap));
  const usecaseEntries = await Promise.all(usecases.map(entryMap));
  const initiativeIndexEntries = await Promise.all(
    initiativesIndex.map(entryMap)
  );
  const usecaseIndexEntries = await Promise.all(usecaseIndex.map(entryMap));
  const whyOpenDataEntries = await Promise.all(whyOpenData.map(entryMap));
  const whyAirQualityEntries = await Promise.all(whyAirQuality.map(entryMap));

  const buildPath = (paths: string[], slug: string) => {
    const fullPath = [...paths, slug].join("/");

    const url = new URL(fullPath, siteUrl);
    return url;
  };

  const buildUrlEntry = ({
    lastModified,
    slug,
    route,
  }: {
    lastModified: string;
    slug?: string;
    route?: string[];
  }) => {
    if (!slug || !route) return;

    const url = buildPath(route, slug);

    return `<url>
    <loc>${url.href}</loc>
  
    ${
      lastModified
        ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>`
        : `<lastmod>No latest modified date found</lastmod>`
    }
    </url>`;
  };

  const result = `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${siteUrl}</loc></url>



  </urlset>  `.trim();

  return new Response(result, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
// GOOD TO GO
// ${initiativeEntries.map(buildUrlEntry).join("\n")}
//${whyAirQualityEntries.map(buildUrlEntry).join("\n")}
// ${whyOpenDataEntries.map(buildUrlEntry).join("\n")}
//${initiativeIndexEntries.map(buildUrlEntry).join("\n")}
//${aboutEntries.map(buildUrlEntry).join("\n")}

// FAILING
//  ${peopleIndexEntries.map(buildUrlEntry).join("\n")}
//${airsensorEntries.map(buildUrlEntry).join("\n")}
//${staffEntries.map(buildUrlEntry).join("\n")}
// ${ambassadorEntries.map(buildUrlEntry).join("\n")}
// ${partnerEntries.map(buildUrlEntry).join("\n")}
//${funderEntries.map(buildUrlEntry).join("\n")}
//${helpEntries.map(buildUrlEntry).join("\n")}
// ${usecaseEntries.map(buildUrlEntry).join("\n")}
//${policiesEntries.map(buildUrlEntry).join("\n")}
// ${usecaseIndexEntries.map(buildUrlEntry).join("\n")}
// ${corporateEntries.map(buildUrlEntry).join("\n")}
// ${partnerEntries.map(buildUrlEntry).join("\n")}
//
