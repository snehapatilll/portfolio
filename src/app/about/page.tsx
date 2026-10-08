import type { Metadata } from "next";
import { ContactBlock } from "@/components/contact-block";
import { Reveal } from "@/components/reveal";
import { StackGrid } from "@/components/stack-grid";
import { Timeline } from "@/components/timeline";
import { SectionHeader } from "@/components/ui/section-header";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.summary,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-24 px-4 py-20">
      {/* Narrative */}
      <section>
        <p className="eyebrow">About</p>
        <h1 className="mt-2 text-3xl font-medium sm:text-4xl">
          {profile.name}
        </h1>
        <p className="mt-3 max-w-[68ch] text-muted">{profile.headline}</p>
        <div className="mt-8 max-w-[68ch] space-y-5">
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Experience"
            title="Where I have worked"
            description="Dates as they appear on my resume."
          />
        </Reveal>
        <div className="mt-10">
          <Timeline roles={profile.experience} />
        </div>
      </section>

      {/* Education */}
      <section>
        <Reveal>
          <SectionHeader eyebrow="Education" title="Degree" />
        </Reveal>
        <div className="mt-8 border border-border bg-surface p-5">
          <p className="eyebrow">{profile.education.period}</p>
          <h3 className="mt-2 font-medium text-text">
            {profile.education.degree}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {profile.education.institution} · {profile.education.detail}
          </p>
        </div>
      </section>

      {/* Stack */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Stack"
            title="Tools, and where I actually used them"
            description="No percentage bars. Every line below names the work it came from, so you can ask about any of it."
          />
        </Reveal>
        <div className="mt-10">
          <StackGrid groups={profile.stack} />
        </div>
      </section>

      {/* Contact */}
      <section>
        <Reveal>
          <SectionHeader eyebrow="Contact" title="Getting in touch" />
        </Reveal>
        <div className="mt-8">
          <ContactBlock />
        </div>
      </section>
    </div>
  );
}
