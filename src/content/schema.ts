import { z } from 'zod';

/**
 * Projects — the WORK section.
 * One Markdown file per project in content/projects. v1 ships placeholders.
 */
export const projectSchema = z.object({
  title: z.string(),
  order: z.number().int(),
  /** Short technical descriptor, e.g. "SOFTWARE", "HARDWARE", "RESEARCH". */
  type: z.string().optional(),
  year: z.string().optional(),
  status: z.enum(['placeholder', 'in-progress', 'shipped', 'archived']).default('placeholder'),
  /** External URL or a future internal route. When absent the row is not a link. */
  href: z.string().optional(),
  draft: z.boolean().default(false),
});

/**
 * Lab — experiments, research, prototypes, failures, notes, build logs.
 * One Markdown file per entry in content/lab. Only a draft template exists in v1.
 */
export const labSchema = z.object({
  title: z.string(),
  category: z.enum(['experiments', 'research', 'prototypes', 'failures']),
  date: z.coerce.date(),
  summary: z.string().optional(),
  status: z.enum(['open', 'ongoing', 'closed']).default('open'),
  draft: z.boolean().default(false),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type LabData = z.infer<typeof labSchema>;

export interface Entry<T> {
  slug: string;
  data: T;
  body: string;
}
