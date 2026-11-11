import styles from "@/components/dsd-experience.module.css";
import Link from "next/link";
import { EditableSurfaceRegion, prepareEditableSurface } from "@/components/editable-surface";
import { JOURNEY_CORE, JOURNEY_CYCLE, JOURNEY_INTERCULTURAL, JOURNEY_PATHWAYS, journeyHref } from "@/lib/content/leadership-journey";
import { stringValue } from "@/lib/content/staff-surface-registry";
import { TRAINING_CREDIT_NOTICE } from "@/lib/program/learning-credit";

export const metadata = { title: "Your leadership journey | One DSD" };

export default async function Page() {
  const surface = await prepareEditableSurface("leadership.journey");
  const copy = surface.values;
  return <EditableSurfaceRegion surface={surface} className={styles.page}>
    <div className="wrap max-w-6xl py-10">
      <Link href="/one-dsd/leadership">← DEIA leadership and growth</Link>
      <header className={`${styles.hero} my-7 rounded-2xl border border-[#ded5c7] bg-[#faf7f1] p-7 sm:p-10`}>
        <p className={styles.eyebrow}>Learn. Reflect. Apply. Return.</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">{stringValue(copy, "title")}</h1>
        <p className="mt-5 max-w-3xl text-xl leading-8">{stringValue(copy, "intro")}</p>
        <p className="mt-5 max-w-3xl leading-7">{stringValue(copy, "voluntary")}</p>
      </header>

      <section className="my-10" aria-labelledby="cycle">
        <h2 id="cycle" className="text-3xl font-semibold">How each module works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {JOURNEY_CYCLE.map(([title, body], index) => <li key={title} className={`rounded-xl p-5 ${["bg-[#eef3f8]", "bg-[#f2edf7]", "bg-[#f7eee2]", "bg-[#faf3e8]"][index]}`}>
            <h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 leading-7">{body}</p>
          </li>)}
        </ol>
      </section>

      <section className="my-10" aria-labelledby="start">
        <h2 id="start" className="text-3xl font-semibold">Start with the core</h2>
        <article className="mt-6 rounded-xl border border-line p-6">
          <h3 className="text-2xl font-semibold"><Link href={journeyHref(JOURNEY_CORE.id)}>{JOURNEY_CORE.title}</Link></h3>
          <p className="mt-2 font-semibold">{JOURNEY_CORE.question}</p>
          <p className="mt-3 max-w-3xl leading-7">{JOURNEY_CORE.intro}</p>
          <Link className="mt-4 inline-block font-semibold" href={journeyHref(JOURNEY_CORE.id)}>Open the core modules →</Link>
        </article>
      </section>

      <section className="my-10" aria-labelledby="pathways">
        <h2 id="pathways" className="text-3xl font-semibold">Choose the pathway that fits your work</h2>
        <p className="mt-4 max-w-3xl leading-7">Each pathway has six modules. You can open any of them, in any order.</p>
        <div className={`${styles.entryCards} mt-6 grid gap-5 md:grid-cols-2`}>
          {JOURNEY_PATHWAYS.map(pathway => <article key={pathway.id} className="rounded-xl border border-line p-6">
            <h3 className="text-2xl font-semibold"><Link href={journeyHref(pathway.id)}>{pathway.title}</Link></h3>
            <p className="mt-2 leading-7">For: {pathway.audience}.</p>
            <p className="mt-3 font-semibold leading-7">{pathway.question}</p>
            <Link className="mt-4 inline-block font-semibold" href={journeyHref(pathway.id)}>Open this pathway →</Link>
          </article>)}
        </div>
      </section>

      <section className="my-10 rounded-2xl bg-[#f2edf7] p-7 sm:p-9" aria-labelledby="intercultural">
        <h2 id="intercultural" className="text-3xl font-semibold">{JOURNEY_INTERCULTURAL.title}</h2>
        <p className="mt-2 font-semibold leading-7">{JOURNEY_INTERCULTURAL.question}</p>
        <p className="mt-4 max-w-3xl leading-8">{JOURNEY_INTERCULTURAL.intro}</p>
        <Link className="mt-4 inline-block font-semibold" href={journeyHref(JOURNEY_INTERCULTURAL.id)}>Open intercultural practice →</Link>
      </section>

      <section className="my-10 border-y border-line py-8" aria-labelledby="with-others">
        <h2 id="with-others" className="text-3xl font-semibold">Learning with others</h2>
        <p className="mt-4 max-w-3xl leading-8">Reflection goes further with another person. If you would like company, bring a question to a mentor or peer, or to a Learning Lab. All of it is optional.</p>
        <ul className="mt-5 flex flex-wrap gap-6">
          <li><Link href="/one-dsd/amplify/mentoring">Mentoring and peer learning →</Link></li>
          <li><Link href="/one-dsd/team/learning-lab">Learning Lab →</Link></li>
          <li><Link href="/ask">Explore a question with ASK →</Link></li>
        </ul>
      </section>

      <p className="max-w-3xl text-sm leading-6">{TRAINING_CREDIT_NOTICE}</p>
    </div>
  </EditableSurfaceRegion>;
}
