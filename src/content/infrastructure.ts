/**
 * Drawn from the job assistant's own docs/aws-setup.md and server/src/db/pool.ts.
 * Every figure here corresponds to something actually provisioned — resource
 * names included — so this page can be checked against the repo.
 */

export const REGION = "ap-south-1";

export type StackFact = { label: string; value: string; note: string };

export const stackFacts: readonly StackFact[] = [
  {
    label: "Region",
    value: "ap-south-1",
    note: "Mumbai — closest to Bangalore.",
  },
  {
    label: "VPC",
    value: "10.0.0.0/16",
    note: "Custom VPC. DNS hostnames enabled — off by default, and without it the RDS endpoint will not resolve.",
  },
  {
    label: "Database",
    value: "db.t4g.micro",
    note: "PostgreSQL, 20 GB, Single-AZ, storage autoscaling off. No public IP.",
  },
  {
    label: "Bastion",
    value: "t3.micro",
    note: "Amazon Linux 2023, launched with no key pair at all.",
  },
  {
    label: "Inbound rules on the bastion",
    value: "0",
    note: "The SSM agent opens an outbound HTTPS connection and holds it; sessions are pushed down that. There is no port to scan.",
  },
  {
    label: "Cost past the free tier",
    value: "~$15/mo",
    note: "Zero inside the 12-month free tier, provided the bastion is stopped when not in use.",
  },
];

export type Decision = {
  id: string;
  title: string;
  saving?: string;
  body: string;
};

export const decisions: readonly Decision[] = [
  {
    id: "private-subnets",
    title: "The database sits in private subnets with no 0.0.0.0/0 route",
    body: "The private subnets stay on the main route table, which has no internet gateway entry. There is no path to or from the internet regardless of what else is misconfigured later — the isolation is a property of the routing, not of a rule somebody has to remember to keep correct.",
  },
  {
    id: "ssm-over-ssh",
    title: "SSM Session Manager instead of SSH",
    body: "The bastion has no inbound security group rules and no key pair. Access is an IAM decision rather than possession of a file, it is logged, and there is nothing to rotate or leak — including into CI. A security group allowing port 22 from anywhere is the thing that gets scanned.",
  },
  {
    id: "no-nat",
    title: "No NAT gateway",
    saving: "~$32/mo",
    body: "It is the default in the VPC creation wizard, which is why most diagrams have one. Nothing here needs it — the database has no reason to make outbound connections — so choosing VPC only at creation removes both a standing cost and an egress path.",
  },
  {
    id: "no-endpoints",
    title: "Bastion in a public subnet, so no VPC interface endpoints",
    saving: "~$21/mo",
    body: "Reaching Systems Manager from a private subnet requires three interface endpoints, billed per hour each. Putting the bastion in a public subnet lets its agent reach SSM over the internet gateway instead. The bastion is the only thing exposed, and it exposes nothing — it still has zero inbound rules.",
  },
  {
    id: "group-to-group",
    title: "The database firewall references a security group, not an IP range",
    body: "The RDS rule allows 5432 from the bastion's security group. The bastion's public IP changes every time it is stopped and started, and stopping it is the thing that keeps the free tier intact — a CIDR rule would need re-editing after every restart, which is a rule that eventually gets left too wide.",
  },
  {
    id: "two-private-subnets",
    title: "Two private subnets for a single-AZ database",
    body: "An RDS subnet group must span two availability zones even when the instance itself is Single-AZ. The second subnet carries no instance; it exists so the subnet group is valid. Worth knowing before the console refuses the configuration.",
  },
];

export type CostTrap = {
  trap: string;
  cost: string;
  avoidedBy: string;
};

export const costTraps: readonly CostTrap[] = [
  {
    trap: "NAT Gateway — the VPC wizard's default",
    cost: "~$32/mo",
    avoidedBy: "Choosing VPC only",
  },
  {
    trap: "VPC interface endpoints for SSM",
    cost: "~$21/mo",
    avoidedBy: "Putting the bastion in a public subnet",
  },
  {
    trap: "Multi-AZ RDS",
    cost: "2×",
    avoidedBy: "Single-AZ",
  },
  {
    trap: "Bastion left running",
    cost: "744 hrs/mo",
    avoidedBy: "Stopping it when not working",
  },
];

export type Incident = {
  id: string;
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  lesson: string;
};

/**
 * The three things that actually went wrong. None produced an error that
 * pointed at its own cause, which is the only reason they are interesting.
 */
export const incidents: readonly Incident[] = [
  {
    id: "tls-tunnel",
    title: "TLS through a tunnel: setting servername is not enough",
    symptom:
      "ERR_TLS_CERT_ALTNAME_INVALID — Host: localhost. is not in the cert's altnames: DNS:jaa-db.****.ap-south-1.rds.amazonaws.com",
    cause:
      "Reaching a private RDS instance through an SSM port-forward means dialling localhost while the certificate names the real endpoint, so hostname verification fails. The obvious fix — setting `servername` — does not work on its own, because `pg` overwrites it with the host it actually dialled before handing options to tls.connect. The check still runs against localhost.",
    fix: "Override `checkServerIdentity` to verify against the configured endpoint name. It is still a full identity check — against the name expected rather than the one dialled — and the CA chain is verified either way.",
    lesson:
      "The widely-suggested answer is rejectUnauthorized: false, which makes the error go away by accepting any certificate at all, including an attacker's. Reaching for it here would have turned a hostname-matching problem into no transport security.",
  },
  {
    id: "express-config",
    title: "Express configuration silently uses the default VPC",
    symptom:
      "Not an error. The security group dropdown offered only `default`.",
    cause:
      "RDS's Express configuration never shows the VPC, the subnet group, or the initial database name, and places the instance in the account's default VPC. The dropdown was scoped to that VPC, where the project's security group does not exist — so the instance was created in the default VPC's public subnets, with none of the isolation above.",
    fix: "Recreate with Full configuration, explicitly selecting the VPC and the DB subnet group.",
    lesson:
      "In the RDS console the VPC determines every list below it. When a dropdown is missing the entry you expect, check what the form is scoped to before anything else — a missing option is more often the wrong scope than a missing resource.",
  },
  {
    id: "db-name",
    title: "The initial database name is create-time only",
    symptom: "No `jobassistant` database on an otherwise healthy instance.",
    cause:
      "DBName lives in a collapsed Additional configuration section and cannot be added later by modifying the instance.",
    fix: "Not fatal — RDS always creates a `postgres` database, so connect to that and CREATE DATABASE reaches the same end state.",
    lesson:
      "Worth separating create-time-only settings from modifiable ones before provisioning anything, rather than discovering the distinction afterwards.",
  },
];

/** The connection hardening in server/src/db/pool.ts, beyond the tunnel fix. */
export const connectionNotes: readonly { title: string; body: string }[] = [
  {
    title: "sslmode is stripped from the connection string",
    body: "Managed Postgres URLs often ship with sslmode and channel_binding query params. `pg` currently treats sslmode=require as an alias for verify-full but warns this will move to weaker libpq semantics in a future major. Stripping them and configuring TLS explicitly means the security level is deterministic and cannot silently weaken on a dependency upgrade.",
  },
  {
    title: "The RDS CA bundle is fetched, never committed",
    body: "Amazon rotates it, and a stale copy in version control is worse than none at all. server/certs/*.pem is gitignored.",
  },
  {
    title: "Nothing in the app is provider-specific",
    body: "The pool takes a DATABASE_URL and two optional TLS settings. The project ran on Neon before RDS; moving between them changed configuration, not code.",
  },
];
