import Link from "next/link";
import { profile } from "@/content/profile";
import { RESUME_FILE, RESUME_PATH } from "@/lib/resume";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-faint">
          {profile.name} · {profile.location}
        </p>
        <ul className="flex flex-wrap items-center gap-4 font-mono text-xs">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="text-muted transition-colors hover:text-accent"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-accent"
            >
              LinkedIn
            </a>
          </li>
          <li>
            <Link
              href="/colophon"
              className="text-muted transition-colors hover:text-accent"
            >
              Colophon
            </Link>
          </li>
          <li>
            <Link
              href="/infrastructure"
              className="text-muted transition-colors hover:text-accent"
            >
              Infrastructure
            </Link>
          </li>
          <li>
            <Link
              href={RESUME_PATH}
              download={RESUME_FILE}
              className="text-muted transition-colors hover:text-accent"
            >
              Résumé
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
