import Link from "next/link";
import { ArrowDownToLine, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section className="blueprint border-b border-border">
      <div className="mx-auto max-w-[1100px] px-4 py-20 sm:py-28">
        <p className="eyebrow">
          Full-stack engineer · {profile.location.split(",")[0]} ·{" "}
          <span className="text-accent">Available now</span>
        </p>

        <h1 className="mt-5 max-w-3xl text-3xl leading-[1.15] font-medium sm:text-5xl">
          {profile.headline}
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {profile.summary}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button asChild variant="primary">
            {/* Lands on Labs, which leads with the RBAC panel — the strongest
                artifact — without the label framing her as an authorization
                specialist rather than a full-stack engineer. */}
            <Link href="/labs">
              See it running
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/work">Case studies</Link>
          </Button>
          <Button asChild variant="ghost">
            <a href="/resume.pdf" download>
              Résumé
              <ArrowDownToLine className="size-3.5" aria-hidden />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
