import type { Metadata } from "next";
import Link from "next/link";
import { VpcDiagram } from "@/components/infra/vpc-diagram";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/section-header";
import {
  connectionNotes,
  costTraps,
  decisions,
  incidents,
  stackFacts,
} from "@/content/infrastructure";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "The AWS topology behind my job assistant — a PostgreSQL instance with no route to the internet, reached through Systems Manager, and the reasoning behind each choice.",
};

export default function InfrastructurePage() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-24 px-4 py-20">
      <SectionHeader
        eyebrow="Infrastructure"
        title="A database with no route to the internet"
        description="The AWS stack behind my job assistant, and why each piece is shaped the way it is. I built this by hand in the console rather than from a template, which is the only reason I can tell you what the defaults would have cost."
        action={
          <Button asChild variant="secondary">
            <Link href="/work/job-assistant">Read the case study</Link>
          </Button>
        }
        as="h1"
      />

      {/* Stack facts */}
      <section>
        <dl className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {stackFacts.map((fact) => (
            <div key={fact.label} className="bg-surface p-4">
              <dt className="eyebrow">{fact.label}</dt>
              <dd>
                <p className="mt-1.5 font-mono text-lg text-text">
                  {fact.value}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-faint">
                  {fact.note}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Diagram */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Topology"
            title="What is actually provisioned"
            description="Resource names and CIDRs match the repo, so this can be checked rather than taken on faith."
          />
        </Reveal>
        <div className="mt-8">
          <VpcDiagram />
        </div>
      </section>

      {/* Decisions */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Decisions"
            title="Six choices, and what each one is avoiding"
            description="Two of these are the difference between a free stack and roughly $53 a month — which is most of the reason a personal project like this usually gets torn down."
          />
        </Reveal>
        <ol className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2">
          {decisions.map((decision, index) => (
            <li key={decision.id} className="bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-mono text-[0.6875rem] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                {decision.saving ? (
                  <Badge tone="ok">saves {decision.saving}</Badge>
                ) : null}
              </div>
              <h3 className="mt-3 leading-snug font-medium text-text">
                {decision.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {decision.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Cost traps */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Cost"
            title="The four things that produce a bill"
            description="In the order people hit them. The first is the VPC wizard's default, which is why it catches everyone."
          />
        </Reveal>
        <div className="mt-8 overflow-x-auto border border-border">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface">
                <th className="eyebrow border-b border-border p-3 font-normal">
                  Trap
                </th>
                <th className="eyebrow border-b border-border p-3 font-normal">
                  Cost
                </th>
                <th className="eyebrow border-b border-border p-3 font-normal">
                  Avoided by
                </th>
              </tr>
            </thead>
            <tbody>
              {costTraps.map((trap) => (
                <tr key={trap.trap}>
                  <td className="border-b border-border p-3 text-sm text-text">
                    {trap.trap}
                  </td>
                  <td className="border-b border-border p-3 font-mono text-xs whitespace-nowrap text-warn">
                    {trap.cost}
                  </td>
                  <td className="border-b border-border p-3 text-sm text-muted">
                    {trap.avoidedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 max-w-[68ch] text-sm leading-relaxed text-faint">
          A zero-spend budget goes in under Billing before anything is created —
          the alarm matters more than the estimate.
        </p>
      </section>

      {/* Incidents */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="What went wrong"
            title="Three problems that pointed nowhere"
            description="None of these produced an error naming its own cause, which is the only reason they are worth writing down."
          />
        </Reveal>
        <div className="mt-8 space-y-px border border-border bg-border">
          {incidents.map((incident) => (
            <article key={incident.id} className="bg-surface p-5 sm:p-6">
              <h3 className="leading-snug font-medium text-text">
                {incident.title}
              </h3>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="eyebrow">Symptom</dt>
                  <dd className="mt-1.5 overflow-x-auto border-l-2 border-fail pl-3 font-mono text-[0.6875rem] leading-relaxed text-muted">
                    {incident.symptom}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Cause</dt>
                  <dd className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-muted">
                    {incident.cause}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Fix</dt>
                  <dd className="mt-1.5 max-w-[68ch] text-sm leading-relaxed text-muted">
                    {incident.fix}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">What it taught me</dt>
                  <dd className="mt-1.5 max-w-[68ch] border-l-2 border-accent pl-3 text-sm leading-relaxed text-text">
                    {incident.lesson}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Connection hardening */}
      <section>
        <Reveal>
          <SectionHeader
            eyebrow="Connection"
            title="Certificate verification stays on"
            description="Three smaller decisions in the database pool that are easy to get wrong in the direction of less security."
          />
        </Reveal>
        <ul className="mt-8 grid gap-px border border-border bg-border md:grid-cols-3">
          {connectionNotes.map((note) => (
            <li key={note.title} className="bg-surface p-5">
              <h3 className="text-sm leading-snug font-medium text-text">
                {note.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {note.body}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
