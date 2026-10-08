import type { Metadata } from "next";
import Link from "next/link";
import { ApiExplorer } from "@/components/labs/api-explorer";
import { AssistantDemo } from "@/components/labs/assistant-demo";
import { RbacPlayground } from "@/components/labs/rbac-playground";
import { Reveal } from "@/components/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Three working pieces: the job assistant's scoring, a clone of the four-role permission model I built, and the API contract behind the assistant.",
};

export default function LabsPage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-24 px-4 py-20">
      <SectionHeader
        eyebrow="Labs"
        title="Things you can press"
        description="A case study tells you what I built. These let you check. Everything here runs in your browser — no backend, nothing to rate-limit, nothing to go down."
        as="h1"
      />

      <section id="rbac">
        <Reveal>
          <SectionHeader
            eyebrow="01 · Authorization"
            title="A four-role permission model, running"
            description="Switch roles and watch what each one can see and do. The records, the action buttons and the permission table are all derived from a single rule table — change role and every one of them re-derives. This is the hardest thing on my resume to convey in a bullet point."
            action={
              <Button asChild variant="secondary">
                <Link href="/work/kpi-hub">Read the case study</Link>
              </Button>
            }
          />
        </Reveal>
        <div className="mt-8">
          <RbacPlayground />
        </div>
        <p className="mt-4 max-w-[68ch] text-xs leading-relaxed text-faint">
          Start as <span className="font-mono text-muted">contributor</span>:
          five records, editable only while draft or rejected. Switch to{" "}
          <span className="font-mono text-muted">reviewer</span> and the edit
          capability disappears while workflow actions appear. Switch to{" "}
          <span className="font-mono text-muted">auditor</span> and a second
          facility becomes visible but every write disappears. Switch to{" "}
          <span className="font-mono text-muted">admin</span> and the records
          hidden by facility scope appear for the first time.
        </p>
      </section>

      <section id="assistant">
        <Reveal>
          <SectionHeader
            eyebrow="02 · AI job assistant"
            title="A score you can check the arithmetic on"
            description="The model classifies each requirement — how important it is, and whether the resume meets it. This page then computes the weighted score from those labels in front of you. That split is why the output is testable at all."
            action={
              <Button asChild variant="secondary">
                <Link href="/work/job-assistant">Read the case study</Link>
              </Button>
            }
          />
        </Reveal>
        <div className="mt-8">
          <AssistantDemo />
        </div>
      </section>

      <section id="api">
        <Reveal>
          <SectionHeader
            eyebrow="03 · API contract"
            title="The contract behind it"
            description="Eleven endpoints across four groups. Every path, status code and payload below corresponds to a route in the assistant's Express server — including the choices that are easy to get wrong: identical 401s on login so accounts can't be enumerated, 404 rather than 403 for another user's record, and a user-scoped lookup before the model is ever called."
          />
        </Reveal>
        <div className="mt-8">
          <ApiExplorer />
        </div>
      </section>
    </div>
  );
}
