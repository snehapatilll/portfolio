"use client";

import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Check, EyeOff, RotateCcw, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ACTIONS,
  FACILITIES,
  RECORDS,
  ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_FACILITIES,
  STATUSES,
  type KpiRecord,
  type Role,
  type Status,
} from "@/content/rbac/model";
import {
  CAPABILITY_ACTIONS,
  applyTransition,
  availableTransitions,
  can,
  facilitiesFor,
  visibleRecords,
} from "@/lib/rbac";

const statusTone: Record<Status, string> = {
  draft: "border-border text-faint",
  submitted: "border-accent/40 text-accent",
  in_review: "border-warn/40 text-warn",
  approved: "border-ok/40 text-ok",
  rejected: "border-fail/40 text-fail",
};

const statusLabel: Record<Status, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  approved: "Approved",
  rejected: "Rejected",
};

function facilityName(id: string) {
  const facility = FACILITIES.find((f) => f.id === id);
  return facility ? `${facility.name} · ${facility.city}` : id;
}

export function RbacPlayground() {
  const [role, setRole] = useState<Role>("contributor");
  const [records, setRecords] = useState<readonly KpiRecord[]>(RECORDS);
  const [log, setLog] = useState<readonly string[]>([]);

  const visible = useMemo(() => visibleRecords(role, records), [role, records]);
  const hiddenCount = records.length - visible.length;
  const scopedFacilities = facilitiesFor(role);
  const isAllFacilities = ROLE_FACILITIES[role] === "all";

  function handleTransition(record: KpiRecord, to: Status, label: string) {
    setRecords((current) => applyTransition(current, record.id, to));
    setLog((current) =>
      [`${role} · ${label} · ${record.id} → ${statusLabel[to]}`, ...current].slice(0, 5),
    );
  }

  function reset() {
    setRecords(RECORDS);
    setLog([]);
  }

  return (
    <div
      data-testid="rbac-playground"
      className="border border-border bg-surface"
    >
      {/* Role switcher */}
      <div className="border-b border-border p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow">Signed in as</p>
          <Button variant="ghost" onClick={reset} className="px-2 py-1">
            <RotateCcw className="size-3" aria-hidden />
            Reset
          </Button>
        </div>

        <div
          role="radiogroup"
          aria-label="Role"
          className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {ROLES.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={role === option}
              onClick={() => setRole(option)}
              className={cn(
                "border px-3 py-2 text-left font-mono text-xs tracking-wide uppercase transition-colors",
                role === option
                  ? "border-accent bg-accent text-accent-contrast"
                  : "border-border text-muted hover:border-border-strong hover:text-text",
              )}
            >
              {option}
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted">
          {ROLE_DESCRIPTIONS[role]}
        </p>

        <p className="mt-3 font-mono text-[0.6875rem] text-faint">
          Tenant scope:{" "}
          <span className="text-muted">
            {isAllFacilities
              ? "all facilities"
              : scopedFacilities.map(facilityName).join(" · ")}
          </span>
        </p>
      </div>

      <Tabs.Root defaultValue="records">
        <Tabs.List className="flex border-b border-border">
          {[
            { value: "records", label: "Records" },
            { value: "matrix", label: "Permission table" },
          ].map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="relative px-4 py-3 font-mono text-xs tracking-wide text-muted uppercase transition-colors data-[state=active]:text-text"
            >
              {tab.label}
              <span className="absolute inset-x-0 -bottom-px hidden h-px bg-accent data-[state=active]:block" />
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* Records */}
        <Tabs.Content value="records" className="p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="font-mono text-[0.6875rem] text-muted">
              {visible.length} of {records.length} records visible
            </p>
            {hiddenCount > 0 ? (
              <p className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] text-faint">
                <EyeOff className="size-3" aria-hidden />
                {hiddenCount} hidden by facility scope
              </p>
            ) : null}
          </div>

          <ul className="mt-4 space-y-3">
            {visible.map((record) => {
              const transitions = availableTransitions(role, record);
              return (
                <li
                  key={record.id}
                  className="border border-border bg-base p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.6875rem] text-faint">
                        {record.id} · {facilityName(record.facilityId)} ·{" "}
                        {record.period}
                      </p>
                      <p className="mt-1.5 text-sm text-text">
                        {record.metric}{" "}
                        <span className="font-mono text-muted">
                          {record.value}
                        </span>
                      </p>
                    </div>
                    <Badge className={statusTone[record.status]}>
                      {statusLabel[record.status]}
                    </Badge>
                  </div>

                  {/* Capability chips, derived from the rule table */}
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {CAPABILITY_ACTIONS.map((action) => {
                      const decision = can(role, action, record);
                      return (
                        <li key={action}>
                          <span
                            title={
                              decision.allowed
                                ? decision.rationale
                                : decision.explain
                            }
                            className={cn(
                              "inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[0.6875rem]",
                              decision.allowed
                                ? "border-ok/30 text-ok"
                                : "border-border text-faint line-through decoration-faint/50",
                            )}
                          >
                            {decision.allowed ? (
                              <Check className="size-2.5" aria-hidden />
                            ) : (
                              <X className="size-2.5" aria-hidden />
                            )}
                            {action}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {transitions.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
                      {transitions.map((transition) => (
                        <Button
                          key={`${transition.action}-${transition.to}`}
                          variant={
                            transition.action === "reject"
                              ? "secondary"
                              : "primary"
                          }
                          className="px-3 py-1.5"
                          onClick={() =>
                            handleTransition(
                              record,
                              transition.to,
                              transition.label,
                            )
                          }
                        >
                          {transition.label}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 border-t border-border pt-4 font-mono text-[0.6875rem] text-faint">
                      No workflow action available to {role} at this status.
                    </p>
                  )}
                </li>
              );
            })}
          </ul>

          {visible.length === 0 ? (
            <p className="border border-border bg-base p-8 text-center text-sm text-faint">
              No records in this role&rsquo;s facility scope.
            </p>
          ) : null}

          {log.length > 0 ? (
            <div className="mt-5 border border-border bg-base p-4">
              <p className="eyebrow">Audit ledger</p>
              <ul className="mt-2 space-y-1">
                {log.map((entry, index) => (
                  <li
                    key={`${entry}-${index}`}
                    className="font-mono text-[0.6875rem] text-muted"
                  >
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Tabs.Content>

        {/* Permission matrix */}
        <Tabs.Content value="matrix" className="p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-muted">
            Every chip and button on the Records tab is derived from this table.
            There is no second copy of the rules in the UI — which is exactly the
            thing I would do differently on the original system.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr>
                  <th className="eyebrow border-b border-border p-2 font-normal">
                    Action
                  </th>
                  {ROLES.map((r) => (
                    <th
                      key={r}
                      className="eyebrow border-b border-border p-2 text-center font-normal"
                    >
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIONS.map((action) => (
                  <tr key={action}>
                    <td className="border-b border-border p-2 font-mono text-xs text-muted">
                      {action}
                    </td>
                    {ROLES.map((r) => {
                      // Scope-independent view: does any rule grant this at all?
                      const granted = can(r, action, {
                        facilityId: facilitiesFor(r)[0] ?? "",
                        status: "draft",
                      });
                      const everGranted = STATUSES.some(
                        (status) =>
                          can(r, action, {
                            facilityId: facilitiesFor(r)[0] ?? "",
                            status,
                          }).allowed,
                      );
                      return (
                        <td
                          key={r}
                          className="border-b border-border p-2 text-center"
                        >
                          {everGranted ? (
                            <Check
                              className={cn(
                                "mx-auto size-3.5",
                                granted.allowed ? "text-ok" : "text-warn",
                              )}
                              aria-label={
                                granted.allowed
                                  ? "Allowed"
                                  : "Allowed at some statuses"
                              }
                            />
                          ) : (
                            <span
                              className="text-faint"
                              aria-label="Not allowed"
                            >
                              —
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 font-mono text-[0.6875rem] leading-relaxed text-faint">
            <span className="text-ok">✓</span> allowed now ·{" "}
            <span className="text-warn">✓</span> allowed only at certain
            statuses · — never granted
          </p>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
