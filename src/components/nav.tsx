"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Infrastructure is intentionally not here. It documents one side project, and
 * a top-level slot gave it the same weight as two years of paid work. It is
 * reached from the job assistant case study, where it belongs.
 */
const routes = [
  { href: "/work", label: "Work" },
  { href: "/labs", label: "Labs" },
  { href: "/notes", label: "Notes" },
  { href: "/about", label: "About" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-base/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-[1100px] items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-text"
          onClick={() => setOpen(false)}
        >
          sneha<span className="text-accent">.</span>patil
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {routes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                aria-current={isActive(route.href) ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 font-mono text-xs tracking-wide uppercase transition-colors",
                  isActive(route.href)
                    ? "text-text"
                    : "text-muted hover:text-text",
                )}
              >
                {route.label}
                {isActive(route.href) ? (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-px h-px bg-accent"
                  />
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-9 place-items-center border border-border text-muted md:hidden"
          >
            {open ? (
              <X className="size-4" aria-hidden />
            ) : (
              <Menu className="size-4" aria-hidden />
            )}
          </button>
        </div>
      </nav>

      {open ? (
        <ul className="border-t border-border bg-base md:hidden">
          {routes.map((route) => (
            <li key={route.href} className="border-b border-border last:border-0">
              <Link
                href={route.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(route.href) ? "page" : undefined}
                className={cn(
                  "block px-4 py-3 font-mono text-xs tracking-wide uppercase",
                  isActive(route.href) ? "text-accent" : "text-muted",
                )}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
