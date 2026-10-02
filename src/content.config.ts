import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects — the WORK section.
 * v1 ships placeholders. Replace the files in src/content/projects with real case studies;
 * the homepage list and (later) /work/[slug] read from here.
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int(),
    /** Short technical descriptor, e.g. "SOFTWARE", "HARDWARE", "RESEARCH". */
    type: z.string().optional(),
    year: z.string().optional(),
    status: z.enum(['placeholder', 'in-progress', 'shipped', 'archived']).default('placeholder'),
    /** External URL or a future internal route. When absent the row is not a link. */
    href: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Lab — experiments, research, prototypes, failures, notes, build logs.
 * Empty in v1 on purpose. The LAB section renders categories from site config and counts from here.
 */
const lab = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/lab' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['experiments', 'research', 'prototypes', 'failures']),
    date: z.coerce.date(),
    summary: z.string().optional(),
    status: z.enum(['open', 'ongoing', 'closed']).default('open'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, lab };
