"use client";

import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiGroups, type Endpoint } from "@/content/openapi";

const methodTone: Record<string, string> = {
  GET: "border-ok/40 text-ok",
  POST: "border-accent/40 text-accent",
};

function statusTone(status: number) {
  if (status < 300) return "text-ok";
  if (status < 400) return "text-muted";
  if (status < 500) return "text-warn";
  return "text-fail";
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto border border-border bg-base p-3 font-mono text-[0.6875rem] leading-relaxed text-muted">
      <code>{children}</code>
    </pre>
  );
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  return (
    <Accordion.Item
      value={`${endpoint.method} ${endpoint.path}`}
      className="border-b border-border last:border-b-0"
    >
      <Accordion.Header>
        <Accordion.Trigger className="group flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-raised">
          <span
            className={cn(
              "w-14 shrink-0 border px-1.5 py-0.5 text-center font-mono text-[0.625rem]",
              methodTone[endpoint.method],
            )}
          >
            {endpoint.method}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-mono text-xs text-text">
              {endpoint.path}
            </span>
            <span className="mt-0.5 block truncate text-xs text-faint">
              {endpoint.summary}
            </span>
          </span>
          {endpoint.auth ? (
            <Lock
              className="size-3 shrink-0 text-faint"
              aria-label="Requires a session"
            />
          ) : null}
          <ChevronDown
            className="size-3.5 shrink-0 text-faint transition-transform group-data-[state=open]:rotate-180"
            aria-hidden
          />
        </Accordion.Trigger>
      </Accordion.Header>

      <Accordion.Content className="overflow-hidden">
        <div className="space-y-4 border-t border-border bg-surface p-4">
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted">
            {endpoint.description}
          </p>

          {endpoint.requestBody ? (
            <div>
              <p className="eyebrow">
                Request · {endpoint.requestBody.contentType}
              </p>
              <div className="mt-2">
                <CodeBlock>{endpoint.requestBody.example}</CodeBlock>
              </div>
            </div>
          ) : null}

          <div>
            <p className="eyebrow">Responses</p>
            <ul className="mt-2 space-y-3">
              {endpoint.responses.map((response) => (
                <li key={response.status}>
                  <p className="font-mono text-[0.6875rem]">
                    <span className={statusTone(response.status)}>
                      {response.status}
                    </span>{" "}
                    <span className="text-faint">{response.meaning}</span>
                  </p>
                  {response.example ? (
                    <div className="mt-1.5">
                      <CodeBlock>{response.example}</CodeBlock>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export function ApiExplorer() {
  const [group, setGroup] = useState(apiGroups[0]!.name);
  const active = apiGroups.find((g) => g.name === group) ?? apiGroups[0]!;

  return (
    <div className="border border-border bg-surface">
      <div className="flex flex-wrap gap-px border-b border-border bg-border">
        {apiGroups.map((candidate) => (
          <button
            key={candidate.name}
            type="button"
            aria-pressed={candidate.name === active.name}
            onClick={() => setGroup(candidate.name)}
            className={cn(
              "flex-1 px-4 py-3 font-mono text-xs tracking-wide uppercase transition-colors",
              candidate.name === active.name
                ? "bg-raised text-text"
                : "bg-surface text-muted hover:text-text",
            )}
          >
            {candidate.name}
            <span className="ml-2 text-faint">
              {candidate.endpoints.length}
            </span>
          </button>
        ))}
      </div>

      <p className="border-b border-border p-4 text-sm leading-relaxed text-muted">
        {active.blurb}
      </p>

      <Accordion.Root type="single" collapsible>
        {active.endpoints.map((endpoint) => (
          <EndpointRow
            key={`${endpoint.method} ${endpoint.path}`}
            endpoint={endpoint}
          />
        ))}
      </Accordion.Root>
    </div>
  );
}
