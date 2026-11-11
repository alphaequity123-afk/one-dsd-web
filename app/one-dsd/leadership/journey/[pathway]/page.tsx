import styles from "@/components/dsd-experience.module.css";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { courseHref, courseText, publishedCourses } from "@/lib/content/courses/published";
import { findLessons } from "@/lib/content/knowledge";
import {
  ALL_JOURNEY_PATHWAYS, JOURNEY_INTERCULTURAL, JOURNEY_INTERCULTURAL_PARTS, JOURNEY_ROUTE, getJourneyPathway, journeyHref,
  type JourneyLink, type JourneyModule, type JourneyPathway,
} from "@/lib/content/leadership-journey";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";

type Props = { params: Promise<{ pathway: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pathway = getJourneyPathway((await params).pathway);
  return { title: pathway ? `${pathway.title} | Your leadership journey` : "Your leadership journey" };
}

type Resources = { lessons: JourneyLink[]; more: JourneyLink[] };

/** Only what is published in this view is shown; a module's list can be shorter than its plan. */
function moduleResources(module: JourneyModule, pathway: JourneyPathway, courses: Map<string, { title: string; lessons: Map<string, string> }>): Resources {
  const lessons = module.courses.flatMap(id => courses.has(id) ? [{ label: courses.get(id)!.title, href: courseHref(id) }] : []);
  const named = new Set(module.courses);
  // Related lessons must share the module's subject, judged by words in common with its title and question.
  const words = new Set(`${module.title} ${module.question} ${module.youCan}`.toLowerCase().match(/[a-z]{5,}/g) ?? []);
  const seen = new Set<string>();
  const more = findLessons({ competencies: module.competencies }).flatMap(lesson => {
    const course = courses.get(lesson.courseId);
    const title = course?.lessons.get(lesson.lessonId);
    if (!course || !title || named.has(lesson.courseId) || seen.has(lesson.href)) return [];
    seen.add(lesson.href);
    const label = `${course.title}: ${title}`;
    const shared = (label.toLowerCase().match(/[a-z]{5,}/g) ?? []).filter(word => words.has(word)).length;
    const inScope = pathway.scope && lesson.course.scopes.includes(pathway.scope) ? 0.5 : 0;
    return shared > 0 ? [{ label, href: lesson.href, score: shared + inScope }] : [];
  }).sort((x, y) => y.score - x.score).slice(0, 3).map(({ label, href }) => ({ label, href }));
  return { lessons, more };
}

function ModuleCard({ module, number, resources }: { module: JourneyModule; number: number; resources: Resources }) {
  return <article id={module.id} className="scroll-mt-8 rounded-xl border border-line p-6 sm:p-7">
    <p className="text-sm font-semibold uppercase tracking-widest text-[#71502f]">Module {number}</p>
    <h3 className="mt-2 text-2xl font-semibold">{module.title}</h3>
    <p className="mt-3 text-lg font-semibold leading-7">{module.question}</p>
    <dl className="mt-5 grid gap-5 md:grid-cols-2">
      <div><dt className="font-semibold">After this, you can</dt><dd className="mt-2 leading-7">{module.youCan}</dd></div>
      <div><dt className="font-semibold">Try this in your work</dt><dd className="mt-2 leading-7">{module.tryThis}</dd></div>
    </dl>
    {resources.lessons.length + (module.links?.length ?? 0) > 0 && <>
      <h4 className="mt-6 font-semibold">Learn and practice</h4>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
        {resources.lessons.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
        {(module.links ?? []).map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}
      </ul>
    </>}
    {resources.more.length > 0 && <>
      <h4 className="mt-6 font-semibold">Related lessons</h4>
      <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{resources.more.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
    </>}
    <p className="mt-6 leading-7"><Link href="/learn/intercultural">Reflect on what you tried →</Link></p>
  </article>;
}

export default async function Page({ params }: Props) {
  const pathway = getJourneyPathway((await params).pathway);
  if (!pathway) notFound();
  const [surface, published] = await Promise.all([prepareEditableSurface(`leadership.pathway.${pathway.id}`), publishedCourses("dsd")]);
  const copy = surface.values;
  const courses = new Map(published.map(({ pack }) => [pack.course.id, {
    title: courseText(pack.course.title), lessons: new Map(pack.course.lessons.map(lesson => [lesson.id, courseText(lesson.title)])),
  }]));
  const resources = new Map(pathway.modules.map(module => [module.id, moduleResources(module, pathway, courses)]));
  const card = (module: JourneyModule) => <ModuleCard key={module.id} module={module} number={pathway.modules.indexOf(module) + 1} resources={resources.get(module.id)!} />;
  const others = ALL_JOURNEY_PATHWAYS.filter(other => other.id !== pathway.id);

  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <div className="wrap max-w-5xl py-10">
      <Link href={JOURNEY_ROUTE}>← Your leadership journey</Link>
      <header className={`${styles.hero} my-7 rounded-2xl border border-[#ded5c7] bg-[#faf7f1] p-7 sm:p-10`}>
        <p className={styles.eyebrow}>For: {stringValue(copy, "audience")}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{stringValue(copy, "title")}</h1>
        <p className="mt-5 text-xl font-semibold leading-8">{stringValue(copy, "question")}</p>
        <p className="mt-5 max-w-3xl leading-8">{stringValue(copy, "intro")}</p>
      </header>

      <nav aria-label="Modules in this pathway" className="my-8">
        <h2 className="text-xl font-semibold">In this pathway</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-6 leading-7 sm:columns-2">{pathway.modules.map(module => <li key={module.id}><a href={`#${module.id}`}>{module.title}</a></li>)}</ol>
      </nav>

      {pathway.id === JOURNEY_INTERCULTURAL.id
        ? JOURNEY_INTERCULTURAL_PARTS.map(part => <section key={part.title} className="my-10" aria-labelledby={`part-${part.title}`}>
            <h2 id={`part-${part.title}`} className="text-3xl font-semibold">{part.title}</h2>
            <p className="mt-3 max-w-3xl leading-7">{part.description}</p>
            <div className="mt-6 space-y-6">{pathway.modules.filter(module => (part.unitIds as readonly string[]).includes(module.id)).map(card)}</div>
          </section>)
        : <section className="my-10 space-y-6" aria-label="Modules">{pathway.modules.map(card)}</section>}

      <section className="my-10 border-t border-line pt-8" aria-labelledby="more">
        <h2 id="more" className="text-2xl font-semibold">Other pathways</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">{others.map(other => <li key={other.id}><Link className="font-semibold" href={journeyHref(other.id)}>{other.title} →</Link></li>)}</ul>
      </section>
      <p className="max-w-3xl text-sm leading-6">{TRAINING_CREDIT_NOTICE}</p>
    </div>
  </EditableSurfaceRegion>;
}
