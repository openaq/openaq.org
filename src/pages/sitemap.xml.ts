import { getCollection } from "astro:content";
import { render } from "astro:content";

export async function GET() {
  const siteUrl = import.meta.env.SITE;

  const staff = await getCollection("staff");
  const ambassadors = await getCollection("ambassadors");
  const initiatives = await getCollection("initiatives");
  const policies = await getCollection("policies");
  const usecases = await getCollection("usecases");
  const help = await getCollection("help");
  //   const singlePages = import.meta.glob("../../content/*.md", {
  //     eager: true,
  //   });
  //   const pages = Object.values(singlePages);

  const helpEntries = await Promise.all(
    help.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const usecaseEntries = await Promise.all(
    usecases.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const policiesEntries = await Promise.all(
    policies.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const initiativeEntries = await Promise.all(
    initiatives.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const staffEntries = await Promise.all(
    staff.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const ambassadorEntries = await Promise.all(
    ambassadors.map(async (entry) => {
      const { remarkPluginFrontmatter } = await render(entry);
      return {
        collection: entry.collection,
        slug: entry.id,
        lastModified: remarkPluginFrontmatter?.lastModified,
      };
    })
  );

  const peopleSlugPages = [...staffEntries, ...ambassadorEntries];

  const result = `  
    <?xml version="1.0" encoding="UTF-8"?>  
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">  
    <url><loc>${siteUrl}</loc></url>  
    <url><loc>${siteUrl}posts/</loc></url>  


    ${peopleSlugPages
      .map(
        ({ lastModified, slug }) =>
          `<url>
    <loc>${siteUrl}about/people/${slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    </url>`
      )
      .join("\n")}



    ${usecaseEntries
      .map(
        ({ lastModified, slug }) =>
          `<url>
    <loc>${siteUrl}use-cases/${slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    </url>`
      )
      .join("\n")}



    ${initiativeEntries
      .map(
        ({ lastModified, collection, slug }) =>
          `<url>
    <loc>${siteUrl}about/${collection}/${slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    </url>`
      )
      .join("\n")}

        ${policiesEntries
          .map(
            ({ lastModified, slug }) =>
              `<url>
    <loc>${siteUrl}${slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    </url>`
          )
          .join("\n")}

        ${helpEntries
          .map(
            ({ lastModified, collection, slug }) =>
              `<url>
    <loc>${siteUrl}developers/${collection}/${slug}</loc>
    <lastmod>${new Date(lastModified).toISOString()}</lastmod>
    </url>`
          )
          .join("\n")}
      
</urlset>  `.trim();

  return new Response(result, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
