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
  const singlePages = await getCollection("singlePages");
  const about = await getCollection("about");
  const peopleLandingPage = await getCollection("people");
  const partners = await getCollection("partners");
  const airsensors = await getCollection("airsensors");
  const funders = await getCollection("funders");
  const corporate = await getCollection("corporate");
  const landingPages = await getCollection("landingPages");

  type CollectionName =
    | "staff"
    | "ambassadors"
    | "initiatives"
    | "policies"
    | "usecases"
    | "help"
    | "singlePages"
    | "about"
    | "people"
    | "partners"
    | "airsensors"
    | "funders"
    | "corporate"
    | "landingPages";

  const parentSlugs = {
    staff: "about/people/",
    ambassadors: "about/people/",
    initiatives: "about/",
    policies: "",
    usecases: "about/use-cases",
    help: "developers/",
    singlePages: "",
    about: "",
    people: "about/",
    partners: "partners",
    airsensors: "partners",
    corporate: "partners",
    funders: "partners",
    landingPages: "about/",
  };

  const getParentSlug = (collection: CollectionName): string => {
    return parentSlugs[collection];
  };

  const entryMap = async (entry: CollectionEntry<CollectionName>) => {
    const { remarkPluginFrontmatter } = await render(entry);
    const { collection, id } = entry;
    const { lastModified } = remarkPluginFrontmatter;
    return {
      slug: id,
      collection,
      lastModified,
      parentSlug: getParentSlug(collection),
    };
  };

  const helpEntries = await Promise.all(help.map(entryMap));
  const staffEntries = await Promise.all(staff.map(entryMap));
  const ambassadorEntries = await Promise.all(ambassadors.map(entryMap));
  const landingPageEntries = await Promise.all(landingPages.map(entryMap));
  const aboutEntries = await Promise.all(about.map(entryMap));
  const partnerEntries = await Promise.all(partners.map(entryMap));
  const airsensorEntries = await Promise.all(airsensors.map(entryMap));
  const funderEntries = await Promise.all(funders.map(entryMap));
  const corporateEntries = await Promise.all(corporate.map(entryMap));
  const initiativeEntries = await Promise.all(initiatives.map(entryMap));
  const policiesEntries = await Promise.all(policies.map(entryMap));
  const singlePageEntries = await Promise.all(singlePages.map(entryMap));
  const peopleLandingPageEntries = await Promise.all(
    peopleLandingPage.map(entryMap)
  );
  const usecaseEntries = await Promise.all(usecases.map(entryMap));

  const buildUrlEntry = ({
    lastModified,
    slug,
    collection,
    parentSlug,
  }: {
    lastModified: string;
    slug?: string;
    collection: string;
    parentSlug?: string;
  }) => {
    let fullSlug = siteUrl;

    if (collection === "people" && peopleLandingPage.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${collection}`;
    } else if (collection === "ambassadors" && ambassadorEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${slug}`;
    } else if (collection === "singlePages" && singlePageEntries.length > 0) {
      fullSlug = `${fullSlug}${slug}`;
    } else if (collection === "staff" && staffEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${slug}`;
    } else if (collection === "initiatives" && initiativeEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${collection}/${slug}`;
    } else if (collection === "policies" && policiesEntries.length > 0) {
      fullSlug = `${fullSlug}${slug}`;
    } else if (collection === "usecases" && usecaseEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}/${slug}`;
    } else if (collection === "help" && helpEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${collection}/${slug}`;
    } else if (collection === "about" && aboutEntries.length > 0) {
      fullSlug = `${fullSlug}${slug}`;
    } else if (collection === "partners" && partners.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}/${slug}`;
    } else if (collection === "airsensors" && airsensors.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}/${slug}`;
    } else if (collection === "corporate" && corporateEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}/${slug}`;
    } else if (collection === "funders" && funderEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}/${slug}`;
    } else if (collection === "landingPages" && landingPageEntries.length > 0) {
      fullSlug = `${fullSlug}${parentSlug}${collection}`;
    }

    const url = new URL(fullSlug);
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
  ${peopleLandingPageEntries.map(buildUrlEntry).join("\n")}
  ${staffEntries.map(buildUrlEntry).join("\n")}
  ${ambassadorEntries.map(buildUrlEntry).join("\n")}
  ${partnerEntries.map(buildUrlEntry).join("\n")}
  ${funderEntries.map(buildUrlEntry).join("\n")}
  ${corporateEntries.map(buildUrlEntry).join("\n")}
  ${airsensorEntries.map(buildUrlEntry).join("\n")}
  ${helpEntries.map(buildUrlEntry).join("\n")}
  ${partnerEntries.map(buildUrlEntry).join("\n")}
  ${usecaseEntries.map(buildUrlEntry).join("\n")}
  ${landingPageEntries.map(buildUrlEntry).join("\n")}
  ${initiativeEntries.map(buildUrlEntry).join("\n")}
  ${policiesEntries.map(buildUrlEntry).join("\n")}
  ${aboutEntries.map(buildUrlEntry).join("\n")}
  ${singlePageEntries.map(buildUrlEntry).join("\n")}


  </urlset>  `.trim();

  return new Response(result, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
