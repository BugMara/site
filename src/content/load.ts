import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';
import { labSchema, projectSchema, type Entry, type LabData, type ProjectData } from './schema';

const ROOT = path.join(process.cwd(), 'content');

/**
 * Reads every Markdown file in content/<dir>, validates its frontmatter against `schema`
 * and returns the published (non-draft) entries. Files starting with `_` are ignored.
 * Runs at build time only (server components).
 */
async function loadCollection<S extends z.ZodType>(
  dir: string,
  schema: S,
): Promise<Entry<z.infer<S>>[]> {
  const base = path.join(ROOT, dir);
  let files: string[] = [];
  try {
    files = (await readdir(base)).filter((f) => f.endsWith('.md') && !f.startsWith('_'));
  } catch {
    return [];
  }

  const entries = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(base, file), 'utf8');
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`content/${dir}/${file}: invalid frontmatter\n${parsed.error.message}`);
      }
      return { slug: file.replace(/\.md$/, ''), data: parsed.data, body: content.trim() };
    }),
  );

  return entries.filter((e) => !(e.data as { draft?: boolean }).draft);
}

export async function getProjects(): Promise<Entry<ProjectData>[]> {
  const projects = await loadCollection('projects', projectSchema);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

export async function getLabEntries(): Promise<Entry<LabData>[]> {
  const entries = await loadCollection('lab', labSchema);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
