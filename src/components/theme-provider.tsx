"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

/**
 * Dark is the default, but light is a real mode — reviewers toggle it.
 * `attribute="class"` pairs with the `.light` token remap in globals.css.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
