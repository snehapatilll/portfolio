/**
 * A stripped-down clone of the authorization model behind KPI Hub.
 *
 * This is deliberately written the way the case study says it *should* have
 * been written: one declarative table of (role, action, scope) rules, with
 * both the server-side checks and the UI's idea of what you can do derived
 * from that single source. In the real system those two drifted for a while
 * because they were maintained separately.
 *
 * Nothing here is client data. The facilities and records are invented.
 */

export const ROLES = ["admin", "auditor", "reviewer", "contributor"] as const;
export type Role = (typeof ROLES)[number];

export const STATUSES = [
  "draft",
  "submitted",
  "in_review",
  "approved",
  "rejected",
] as const;
export type Status = (typeof STATUSES)[number];

export const ACTIONS = [
  "view",
  "comment",
  "edit",
  "submit",
  "review",
  "approve",
  "reject",
  "export",
] as const;
export type Action = (typeof ACTIONS)[number];

/** "own" = only facilities the viewer is mapped to. "all" = every facility. */
export type Scope = "own" | "all";

export type Rule = {
  role: Role;
  action: Action;
  scope: Scope;
  /** Record must be in one of these statuses. Omitted means any status. */
  whenStatus?: readonly Status[];
  /** Why this rule exists — surfaced in the UI so the table explains itself. */
  rationale: string;
};

export const RULES: readonly Rule[] = [
  // Admin — full reach, but approval still runs through the review workflow.
  { role: "admin", action: "view", scope: "all", rationale: "Admins hold the company-level coverage view across every facility." },
  { role: "admin", action: "comment", scope: "all", rationale: "Admins can annotate any record." },
  { role: "admin", action: "export", scope: "all", rationale: "Company-wide reporting is an admin function." },
  { role: "admin", action: "approve", scope: "all", whenStatus: ["in_review"], rationale: "Admins can break a deadlock, but only on a record already under review." },
  { role: "admin", action: "reject", scope: "all", whenStatus: ["in_review"], rationale: "Same as approve — the record must have reached review first." },

  // Auditor — reads everything in scope, changes nothing. Read-only is the point.
  { role: "auditor", action: "view", scope: "own", rationale: "Auditors are mapped to the facilities they audit, not to the whole company." },
  { role: "auditor", action: "comment", scope: "own", rationale: "Raising a question is the auditor's instrument — they never edit the number." },
  { role: "auditor", action: "export", scope: "own", rationale: "Audit evidence for their own facilities." },

  // Reviewer — the workflow gate.
  { role: "reviewer", action: "view", scope: "own", rationale: "Reviewers see their facility's submissions." },
  { role: "reviewer", action: "comment", scope: "own", rationale: "Feedback to the contributor before a decision." },
  { role: "reviewer", action: "review", scope: "own", whenStatus: ["submitted"], rationale: "Picking up a submitted record is what moves it into review." },
  { role: "reviewer", action: "approve", scope: "own", whenStatus: ["in_review"], rationale: "Only a record they have actually taken into review can be approved." },
  { role: "reviewer", action: "reject", scope: "own", whenStatus: ["in_review"], rationale: "Rejection sends it back to the contributor as a draft." },

  // Contributor — enters the data, and can only change it before it is submitted.
  { role: "contributor", action: "view", scope: "own", rationale: "Contributors see their own facility." },
  { role: "contributor", action: "comment", scope: "own", rationale: "Responding to reviewer feedback." },
  { role: "contributor", action: "edit", scope: "own", whenStatus: ["draft", "rejected"], rationale: "Editable before submission and after a rejection — never while it is under review." },
  { role: "contributor", action: "submit", scope: "own", whenStatus: ["draft", "rejected"], rationale: "Submitting hands the record to a reviewer." },
];

/** Role-gated workflow edges. The status field is never written directly. */
export type Transition = {
  action: Action;
  from: Status;
  to: Status;
  label: string;
};

export const TRANSITIONS: readonly Transition[] = [
  { action: "submit", from: "draft", to: "submitted", label: "Submit" },
  { action: "submit", from: "rejected", to: "submitted", label: "Resubmit" },
  { action: "review", from: "submitted", to: "in_review", label: "Take into review" },
  { action: "approve", from: "in_review", to: "approved", label: "Approve" },
  { action: "reject", from: "in_review", to: "rejected", label: "Reject" },
];

export type Facility = { id: string; name: string; city: string };

export const FACILITIES: readonly Facility[] = [
  { id: "f-blr", name: "Facility A", city: "Bengaluru" },
  { id: "f-pnq", name: "Facility B", city: "Pune" },
  { id: "f-maa", name: "Facility C", city: "Chennai" },
];

/** Which facilities each role is mapped to — the tenant boundary. */
export const ROLE_FACILITIES: Record<Role, readonly string[] | "all"> = {
  admin: "all",
  auditor: ["f-blr", "f-pnq"],
  reviewer: ["f-blr"],
  contributor: ["f-blr"],
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  admin: "Company-wide reach. Sees every facility and can unblock a stalled review.",
  auditor: "Read-only across the facilities they are mapped to. Comments, never edits.",
  reviewer: "The workflow gate for their facility — takes records into review, approves or rejects.",
  contributor: "Enters data for their facility. Can only edit before submission, or after a rejection.",
};

export type KpiRecord = {
  id: string;
  metric: string;
  facilityId: string;
  period: string;
  value: string;
  status: Status;
  enteredBy: string;
};

export const RECORDS: readonly KpiRecord[] = [
  { id: "KPI-1041", metric: "Energy intensity", facilityId: "f-blr", period: "Q3 2026", value: "42.1 kWh/unit", status: "draft", enteredBy: "R. Iyer" },
  { id: "KPI-1042", metric: "Water withdrawal", facilityId: "f-blr", period: "Q3 2026", value: "1,280 kL", status: "submitted", enteredBy: "R. Iyer" },
  { id: "KPI-1043", metric: "Waste diverted", facilityId: "f-blr", period: "Q3 2026", value: "68 %", status: "in_review", enteredBy: "R. Iyer" },
  { id: "KPI-1044", metric: "Lost-time injuries", facilityId: "f-blr", period: "Q2 2026", value: "0", status: "approved", enteredBy: "R. Iyer" },
  { id: "KPI-1045", metric: "Scope 2 emissions", facilityId: "f-blr", period: "Q2 2026", value: "310 tCO2e", status: "rejected", enteredBy: "R. Iyer" },
  { id: "KPI-2010", metric: "Energy intensity", facilityId: "f-pnq", period: "Q3 2026", value: "38.4 kWh/unit", status: "submitted", enteredBy: "M. Kulkarni" },
  { id: "KPI-2011", metric: "Water withdrawal", facilityId: "f-pnq", period: "Q3 2026", value: "940 kL", status: "approved", enteredBy: "M. Kulkarni" },
  { id: "KPI-3002", metric: "Energy intensity", facilityId: "f-maa", period: "Q3 2026", value: "51.7 kWh/unit", status: "in_review", enteredBy: "S. Raman" },
  { id: "KPI-3003", metric: "Waste diverted", facilityId: "f-maa", period: "Q3 2026", value: "54 %", status: "draft", enteredBy: "S. Raman" },
];
