"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

/** Never changes, so the store never notifies — this only reports *where* we are. */
const neverChanges = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  /**
   * The active theme is only knowable on the client. Until hydration everything
   * that depends on it — icon *and* label — has to stay theme-neutral, or the
   * server HTML and the first client render disagree and React logs a
   * hydration mismatch.
   *
   * useSyncExternalStore gives exactly that: the server snapshot is false and
   * the client snapshot is true, with no state write inside an effect.
   */
  const mounted = useSyncExternalStore(
    neverChanges,
    () => true,
    () => false,
  );

  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      aria-label={
        mounted
          ? isDark
            ? "Switch to light theme"
            : "Switch to dark theme"
          : "Toggle theme"
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="grid size-9 place-items-center border border-border text-muted transition-colors hover:bg-surface hover:text-text"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4" aria-hidden />
        ) : (
          <Moon className="size-4" aria-hidden />
        )
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </button>
  );
}
