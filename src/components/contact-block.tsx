// lucide dropped brand marks in v1, and generic icons suit a deliberately
// brand-neutral layout better than logos would. The labels carry the meaning.
import {
  ArrowDownToLine,
  BriefcaseBusiness,
  GitBranch,
  Mail,
} from "lucide-react";
import { profile } from "@/content/profile";

const links = [
  {
    href: `mailto:${profile.email}`,
    label: "Email",
    value: profile.email,
    Icon: Mail,
    external: false,
  },
  {
    href: profile.links.linkedin,
    label: "LinkedIn",
    value: "sneha-patil",
    Icon: BriefcaseBusiness,
    external: true,
  },
  {
    href: profile.links.github,
    label: "GitHub",
    value: "snehapatilll",
    Icon: GitBranch,
    external: true,
  },
  {
    href: "/resume.pdf",
    label: "Résumé",
    value: "PDF",
    Icon: ArrowDownToLine,
    external: false,
  },
] as const;

export function ContactBlock() {
  return (
    <div className="border border-border bg-surface">
      <div className="border-b border-border p-5 sm:p-6">
        <p className="eyebrow">What I am looking for</p>
        <p className="mt-2 max-w-[68ch] leading-relaxed text-text">
          {profile.lookingFor}
        </p>
      </div>

      <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {links.map(({ href, label, value, Icon, external }) => (
          <li key={label} className="bg-surface">
            <a
              href={href}
              {...(external
                ? { target: "_blank", rel: "noreferrer" }
                : label === "Résumé"
                  ? { download: true }
                  : {})}
              className="group flex items-center gap-3 p-4 transition-colors hover:bg-raised"
            >
              <Icon
                className="size-4 shrink-0 text-faint transition-colors group-hover:text-accent"
                aria-hidden
              />
              <span className="min-w-0">
                <span className="eyebrow block">{label}</span>
                <span className="mt-0.5 block truncate font-mono text-xs text-muted">
                  {value}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
