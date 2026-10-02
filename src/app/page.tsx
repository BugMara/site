import { getLabEntries, getProjects } from '@/content/load';
import { site } from '@/config/site';
import { Hero } from '@/components/sections/Hero';
import { Work } from '@/components/sections/Work';
import { About } from '@/components/sections/About';
import { Lab } from '@/components/sections/Lab';
import { Contact } from '@/components/sections/Contact';

export default async function Page() {
  const [projects, labEntries] = await Promise.all([getProjects(), getLabEntries()]);

  const categories = site.lab.categories.map((c) => ({
    ...c,
    count: labEntries.filter((e) => e.data.category === c.key).length,
  }));

  return (
    <>
      <Hero />
      <Work projects={projects.map((p) => ({ slug: p.slug, ...p.data }))} />
      <About />
      <Lab categories={categories} />
      <Contact />
    </>
  );
}
