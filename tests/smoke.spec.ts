import { test, expect, type Page } from "@playwright/test";

/**
 * Every test here guards a bug this project has actually shipped at least once.
 * That is the bar for adding one — not coverage for its own sake.
 */

const ROUTES = [
  "/",
  "/work",
  "/work/kpi-hub",
  "/work/esg-dashboards",
  "/work/commerce-cms",
  "/work/strapi-flattening",
  "/work/job-assistant",
  "/labs",
  "/infrastructure",
  "/notes",
  "/notes/deterministic-scoring",
  "/notes/strapi-flattening",
  "/notes/contract-parity-migration",
  "/about",
  "/colophon",
] as const;

/** React keeps a hidden copy of streamed content; only count what renders. */
async function visibleText(page: Page, selector: string): Promise<string[]> {
  return page.locator(selector).filter({ visible: true }).allTextContents();
}

test.describe("every route renders", () => {
  for (const route of ROUTES) {
    test(`${route} responds and has one visible h1`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should be 200`).toBe(200);

      const headings = await visibleText(page, "h1");
      expect(headings, `${route} should have exactly one visible h1`).toHaveLength(1);
      expect(headings[0]!.trim().length).toBeGreaterThan(0);
    });
  }
});

test.describe("no console errors", () => {
  // Caught the theme-toggle hydration mismatch and the Cache Components
  // "URL data during prerendering" errors on the dynamic routes.
  for (const route of ["/", "/work/kpi-hub", "/notes/deterministic-scoring", "/labs"] as const) {
    test(`${route} logs no errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.goto(route);
      await page.waitForLoadState("networkidle");

      expect(errors).toEqual([]);
    });
  }
});

test.describe("layout", () => {
  // The --spacing misconfiguration doubled every size on the site and only
  // surfaced as horizontal overflow on a phone.
  for (const route of ["/", "/work", "/labs", "/infrastructure", "/about"] as const) {
    test(`${route} has no horizontal scroll`, async ({ page }) => {
      await page.goto(route);
      const overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return { scrollWidth: el.scrollWidth, clientWidth: el.clientWidth };
      });
      expect(
        overflow.scrollWidth,
        `${route} overflows by ${overflow.scrollWidth - overflow.clientWidth}px`,
      ).toBeLessThanOrEqual(overflow.clientWidth);
    });
  }

  test("case study cards in a row are the same height", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "single column on mobile");

    await page.goto("/work");
    const cards = page.locator('a[href^="/work/"]').filter({ visible: true });
    await expect(cards.first()).toBeVisible();

    const boxes = await cards.evaluateAll((nodes) =>
      nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return { top: Math.round(r.top), height: Math.round(r.height) };
      }),
    );

    const byRow = new Map<number, number[]>();
    for (const { top, height } of boxes) {
      byRow.set(top, [...(byRow.get(top) ?? []), height]);
    }
    for (const [top, heights] of byRow) {
      expect(new Set(heights).size, `row at y=${top} has heights ${heights}`).toBe(1);
    }
  });
});

test.describe("home is not a copy of /work", () => {
  test("home shows fewer, lighter teasers", async ({ page }) => {
    await page.goto("/");
    const home = await page.locator('a[href^="/work/"]').filter({ visible: true }).count();

    await page.goto("/work");
    const work = await page.locator('a[href^="/work/"]').filter({ visible: true }).count();

    expect(home).toBeLessThan(work);
    await page.goto("/");
    await expect(page.getByText("Hard part ·")).toHaveCount(0);
  });
});

test.describe("theme", () => {
  test("toggles both ways and keeps the accent readable", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: /theme/i });

    await expect(toggle).toBeVisible();
    const before = await page.evaluate(() => document.documentElement.className);

    await toggle.click();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.className))
      .not.toBe(before);

    // Light mode remaps the accent rather than reusing the dark value, which is
    // what keeps it legible on a light background.
    const accent = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue("--accent").trim(),
    );
    expect(accent).not.toBe("");

    await toggle.click();
    await expect
      .poll(() => page.evaluate(() => document.documentElement.className))
      .toBe(before);
  });
});

test.describe("RBAC playground", () => {
  test("switching role changes what is visible and what can be done", async ({ page }) => {
    await page.goto("/labs");

    // Scope to the widget itself, not the #rbac section — the explanatory copy
    // beneath the playground also contains "hidden by facility scope", so a
    // section-wide locator matches prose instead of state.
    const panel = page.getByTestId("rbac-playground");

    const contributor = panel.getByRole("radio", { name: "contributor" });
    await expect(contributor).toBeVisible();
    await contributor.click();
    const scoped = await panel.getByText(/\d+ of \d+ records visible/).innerText();

    // Admin is mapped to every facility, so nothing is hidden by scope.
    await panel.getByRole("radio", { name: "admin" }).click();
    const all = await panel.getByText(/\d+ of \d+ records visible/).innerText();
    expect(all).not.toBe(scoped);
    await expect(panel.getByText(/hidden by facility scope/)).toHaveCount(0);

    // An auditor is read-only: no workflow transition is ever offered.
    await panel.getByRole("radio", { name: "auditor" }).click();
    for (const action of ["Submit", "Resubmit", "Take into review", "Approve", "Reject"]) {
      await expect(
        panel.getByRole("button", { name: action, exact: true }),
        `auditor must not be offered "${action}"`,
      ).toHaveCount(0);
    }
  });

  test("a contributor submission moves the record for the reviewer", async ({ page }) => {
    await page.goto("/labs");
    await page.getByRole("radio", { name: "contributor" }).click();

    const draft = page.locator("li").filter({ hasText: "KPI-1041" }).first();
    await draft.getByRole("button", { name: "Submit", exact: true }).click();

    await expect(page.getByText(/contributor · Submit · KPI-1041/)).toBeVisible();

    await page.getByRole("radio", { name: "reviewer" }).click();
    const forReviewer = page.locator("li").filter({ hasText: "KPI-1041" }).first();
    await expect(
      forReviewer.getByRole("button", { name: "Take into review" }),
    ).toBeVisible();
  });
});

test.describe("assistant demo", () => {
  test("the displayed score equals the weighted arithmetic shown beside it", async ({
    page,
  }) => {
    await page.goto("/labs");
    const breakdown = await page.getByTestId("score-breakdown").innerText();
    const match = breakdown.match(/(\d+) of (\d+) weighted points/)!;
    const expected = Math.round((Number(match[1]) / Number(match[2])) * 100);

    // "/100" lives in its own span, so locating by that text matches an element
    // with no digits in it. Read the whole score element instead.
    const scoreText = await page.getByTestId("fit-score").innerText();
    const shown = Number(scoreText.replace(/\D/g, "").replace(/100$/, ""));

    expect(shown).toBe(expected);
  });

  test("fixture provenance is stated honestly", async ({ page }) => {
    await page.goto("/labs");
    const sample = page.getByText(/Sample data/);
    const recorded = page.getByText(/Recorded output from a real run/);
    expect((await sample.count()) + (await recorded.count())).toBeGreaterThan(0);
  });
});

test.describe("content integrity", () => {
  test("the metric strip shows four backed numbers", async ({ page }) => {
    await page.goto("/");
    const terms = page.locator("dl dt").filter({ visible: true });
    await expect(terms).toHaveCount(4);
  });

  test("no client is named anywhere", async ({ page }) => {
    for (const route of ["/work/strapi-flattening", "/work/commerce-cms", "/about"] as const) {
      await page.goto(route);
      const body = (await page.locator("body").innerText()).toUpperCase();
      expect(body, `${route} must not name the bank`).not.toContain("HDFC");
    }
  });

  test("resume is downloadable", async ({ page, request }) => {
    await page.goto("/about");
    const response = await request.get("/resume.pdf");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });
});
