const SITE = "https://openaq.org";

export const organization = {
	"@type": "NGO",
	"@id": `${SITE}/#organization`,
	name: "OpenAQ",
	url: `${SITE}/`,
	logo: `${SITE}/logo-512.png`,
	description:
		"OpenAQ is a nonprofit providing universal access to air quality data to help solve air inequality.",
	sameAs: [
		"https://github.com/openaq",
		"https://www.linkedin.com/company/openaq",
		"https://bsky.app/profile/openaq.org",
		"https://openaq.medium.com/",
		"https://www.youtube.com/@openaq4768",
		"https://www.facebook.com/openaq/",
	],
};

export const website = {
	"@type": "WebSite",
	"@id": `${SITE}/#website`,
	url: `${SITE}/`,
	name: "OpenAQ",
	description: "open air quality data from hundreds of sources worldwide.",
	publisher: { "@id": `${SITE}/#organization` },
};

export const schemas = {
	home: { "@context": "https://schema.org", "@graph": [organization, website] },
} as const;

export type SchemaKey = keyof typeof schemas;
