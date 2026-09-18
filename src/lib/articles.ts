import { getCollection, getEntry } from "astro:content";

export interface ArticleSummary {
	title: string;
	description: string;
	slug: string;
	year: string;
	pubDate: Date;
	authorNames: string[];
}

export async function getAllArticles(): Promise<ArticleSummary[]> {
	const entries = await getCollection("articles");

	const summaries = await Promise.all(
		entries.map(async (entry) => {
			const authors = (
				await Promise.all(
					entry.data.authors.map((author) => getEntry(author)),
				)
			).filter((author) => author !== undefined);

			const year = entry.filePath?.match(/\/articles\/(\d{4})\//)?.[1] ?? "";

			return {
				title: entry.data.title,
				description: entry.data.description,
				slug: entry.data.slug,
				year,
				pubDate: entry.data.pubDate,
				authorNames: authors.map((author) => author.data.name),
			};
		}),
	);

	return summaries.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
