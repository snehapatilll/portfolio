import {
  ACTIONS,
  FACILITIES,
  ROLE_FACILITIES,
  RULES,
  TRANSITIONS,
  type Action,
  type KpiRecord,
  type Role,
  type Status,
} from "@/content/rbac/model";

/**
 * One function answers every authorization question. The record table, the
 * action buttons and the permission matrix all call this — so the UI cannot
 * disagree with the rules, because it has no separate opinion to disagree with.
 */

export type Decision =
  | { allowed: true; rationale: string }
  | { allowed: false; reason: "scope" | "role" | "status"; explain: string };

export function facilitiesFor(role: Role): readonly string[] {
  const mapped = ROLE_FACILITIES[role];
  return mapped === "all" ? FACILITIES.map((f) => f.id) : mapped;
}

export function inScope(role: Role, facilityId: string): boolean {
  return facilitiesFor(role).includes(facilityId);
}

/** Records the viewer may see at all. Everything else does not exist to them. */
export function visibleRecords(
  role: Role,
  records: readonly KpiRecord[],
): readonly KpiRecord[] {
  return records.filter(
    (record) =>
      inScope(role, record.facilityId) &&
      can(role, "view", record).allowed,
  );
}

export function can(
  role: Role,
  action: Action,
  record: Pick<KpiRecord, "facilityId" | "status">,
): Decision {
  const candidates = RULES.filter(
    (rule) => rule.role === role && rule.action === action,
  );

  if (candidates.length === 0) {
    return {
      allowed: false,
      reason: "role",
      explain: `No rule grants "${action}" to ${role}.`,
    };
  }

  // Tenant scope is checked before anything else: a record outside the
  // viewer's facilities must not even reveal why it was refused.
  const scoped = candidates.filter(
    (rule) => rule.scope === "all" || inScope(role, record.facilityId),
  );

  if (scoped.length === 0) {
    return {
      allowed: false,
      reason: "scope",
      explain: `${role} is not mapped to this facility.`,
    };
  }

  const match = scoped.find(
    (rule) => !rule.whenStatus || rule.whenStatus.includes(record.status),
  );

  if (!match) {
    const allowedStatuses = [
      ...new Set(scoped.flatMap((rule) => rule.whenStatus ?? [])),
    ].join(", ");
    return {
      allowed: false,
      reason: "status",
      explain: `Allowed only while the record is: ${allowedStatuses}.`,
    };
  }

  return { allowed: true, rationale: match.rationale };
}

/** Workflow moves this role may make on this record, right now. */
export function availableTransitions(role: Role, record: KpiRecord) {
  return TRANSITIONS.filter(
    (transition) =>
      transition.from === record.status &&
      can(role, transition.action, record).allowed,
  );
}

/** Non-workflow actions, for the row's capability chips. */
export const CAPABILITY_ACTIONS: readonly Action[] = ACTIONS.filter(
  (action) => !TRANSITIONS.some((t) => t.action === action),
);

export function applyTransition(
  records: readonly KpiRecord[],
  recordId: string,
  to: Status,
): readonly KpiRecord[] {
  return records.map((record) =>
    record.id === recordId ? { ...record, status: to } : record,
  );
}
