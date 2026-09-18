import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const authors = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/pages/authors" }),
	schema: z.object({
		name: z.string(),
	}),
});

const articles = defineCollection({
	loader: glob({ pattern: "**/index.md", base: "./src/pages/articles" }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		categories: z.array(z.string()).default([]),
		tags: z.array(z.string()).default([]),
		description: z.string(),
		id: z.number(),
		slug: z.string(),
		authors: z.array(reference("authors")),
	}),
});

export const collections = { authors, articles };
