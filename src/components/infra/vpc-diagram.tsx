"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Inline SVG so it can use the theme tokens directly — every stroke and fill
 * is a CSS variable, so the diagram flips with light/dark instead of being two
 * exported images that drift apart.
 */

type NodeId =
  | "vpc"
  | "public"
  | "bastion"
  | "private-a"
  | "rds"
  | "private-b"
  | "igw"
  | "ssm";

const details: Record<NodeId, { title: string; body: string }> = {
  vpc: {
    title: "VPC · 10.0.0.0/16",
    body: "Custom VPC with DNS hostnames enabled — off by default, and without it the RDS endpoint will not resolve.",
  },
  public: {
    title: "Public subnets · 10.0.1.0/24, 10.0.2.0/24",
    body: "Route table carries a 0.0.0.0/0 entry to the internet gateway. Auto-assign public IPv4 is on here only.",
  },
  bastion: {
    title: "Bastion · t3.micro",
    body: "Zero inbound security group rules and no key pair. The SSM agent opens an outbound HTTPS connection and holds it open; sessions arrive down that. Stopped when not in use, which is what keeps the free tier intact.",
  },
  "private-a": {
    title: "Private subnet A · 10.0.11.0/24",
    body: "Stays on the main route table, which has no 0.0.0.0/0 entry. No path to or from the internet.",
  },
  rds: {
    title: "RDS · db.t4g.micro",
    body: "PostgreSQL, 20 GB, Single-AZ, no public IP. Its security group allows 5432 from the bastion's security group — not from an IP range, because the bastion's address changes on every restart.",
  },
  "private-b": {
    title: "Private subnet B · 10.0.12.0/24",
    body: "Carries no instance. It exists because an RDS subnet group must span two availability zones, even for a Single-AZ database.",
  },
  igw: {
    title: "Internet gateway",
    body: "Reachable from the public subnets only. The bastion's agent uses it to reach Systems Manager, which is what avoids paying for three VPC interface endpoints.",
  },
  ssm: {
    title: "AWS Systems Manager",
    body: "Where the operator connects. Access is an IAM decision rather than possession of a key file, and every session is logged.",
  },
};

export function VpcDiagram() {
  const [active, setActive] = useState<NodeId>("rds");
  const detail = details[active];

  const nodeProps = (id: NodeId) => ({
    onMouseEnter: () => setActive(id),
    onFocus: () => setActive(id),
    onClick: () => setActive(id),
    tabIndex: 0,
    role: "button" as const,
    "aria-label": details[id].title,
    className: cn(
      "cursor-pointer outline-none transition-opacity",
      active === id ? "opacity-100" : "opacity-70 hover:opacity-100",
    ),
  });

  const box = (id: NodeId) =>
    active === id ? "var(--accent)" : "var(--border-strong)";

  return (
    <div className="border border-border bg-surface">
      <div className="overflow-x-auto p-4 sm:p-6">
        <svg
          viewBox="0 0 720 400"
          className="w-full min-w-[560px]"
          role="img"
          aria-label="VPC topology: a bastion in a public subnet reaches an RDS instance in a private subnet with no internet route"
        >
          {/* VPC boundary */}
          <g {...nodeProps("vpc")}>
            <rect
              x="8" y="8" width="520" height="384"
              fill="none" stroke={box("vpc")} strokeWidth="1"
              strokeDasharray="4 3"
            />
            <text x="20" y="28" className="fill-[var(--muted)] font-mono text-[11px]">
              VPC 10.0.0.0/16
            </text>
          </g>

          {/* Public subnet */}
          <g {...nodeProps("public")}>
            <rect
              x="28" y="48" width="220" height="150"
              fill="var(--base)" stroke={box("public")} strokeWidth="1"
            />
            <text x="40" y="68" className="fill-[var(--faint)] font-mono text-[10px]">
              public subnet · AZ-a
            </text>
          </g>

          {/* Bastion */}
          <g {...nodeProps("bastion")}>
            <rect
              x="48" y="84" width="180" height="92"
              fill="var(--surface)" stroke={box("bastion")} strokeWidth="1"
            />
            <text x="62" y="108" className="fill-[var(--text)] font-mono text-[12px]">
              bastion EC2
            </text>
            <text x="62" y="128" className="fill-[var(--muted)] font-mono text-[10px]">
              t3.micro · SSM agent
            </text>
            <text x="62" y="152" className="fill-[var(--ok)] font-mono text-[10px]">
              NO inbound rules
            </text>
          </g>

          {/* Private subnet A */}
          <g {...nodeProps("private-a")}>
            <rect
              x="288" y="48" width="220" height="150"
              fill="var(--base)" stroke={box("private-a")} strokeWidth="1"
            />
            <text x="300" y="68" className="fill-[var(--faint)] font-mono text-[10px]">
              private subnet · AZ-a
            </text>
          </g>

          {/* RDS */}
          <g {...nodeProps("rds")}>
            <rect
              x="308" y="84" width="180" height="92"
              fill="var(--surface)" stroke={box("rds")} strokeWidth="1"
            />
            <text x="322" y="108" className="fill-[var(--text)] font-mono text-[12px]">
              RDS PostgreSQL
            </text>
            <text x="322" y="128" className="fill-[var(--muted)] font-mono text-[10px]">
              db.t4g.micro · 20 GB
            </text>
            <text x="322" y="152" className="fill-[var(--ok)] font-mono text-[10px]">
              no public IP
            </text>
          </g>

          {/* Private subnet B */}
          <g {...nodeProps("private-b")}>
            <rect
              x="288" y="218" width="220" height="74"
              fill="var(--base)" stroke={box("private-b")} strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text x="300" y="240" className="fill-[var(--faint)] font-mono text-[10px]">
              private subnet · AZ-b
            </text>
            <text x="300" y="262" className="fill-[var(--faint)] font-mono text-[10px]">
              empty — subnet group
            </text>
            <text x="300" y="278" className="fill-[var(--faint)] font-mono text-[10px]">
              must span 2 AZs
            </text>
          </g>

          {/* bastion -> RDS :5432 */}
          <line
            x1="228" y1="130" x2="304" y2="130"
            stroke="var(--accent)" strokeWidth="1"
            markerEnd="url(#arrow)"
          />
          <text x="236" y="122" className="fill-[var(--accent)] font-mono text-[10px]">
            :5432
          </text>
          <text x="232" y="146" className="fill-[var(--faint)] font-mono text-[9px]">
            sg → sg
          </text>

          {/* Internet gateway */}
          <g {...nodeProps("igw")}>
            <rect
              x="48" y="246" width="180" height="52"
              fill="var(--surface)" stroke={box("igw")} strokeWidth="1"
            />
            <text x="62" y="268" className="fill-[var(--text)] font-mono text-[11px]">
              internet gateway
            </text>
            <text x="62" y="286" className="fill-[var(--faint)] font-mono text-[9px]">
              public subnets only
            </text>
          </g>

          {/* bastion -> igw (outbound 443) */}
          <line
            x1="138" y1="176" x2="138" y2="242"
            stroke="var(--border-strong)" strokeWidth="1"
            markerEnd="url(#arrow-muted)"
          />
          <text x="146" y="214" className="fill-[var(--muted)] font-mono text-[9px]">
            outbound 443
          </text>

          {/* SSM, outside the VPC */}
          <g {...nodeProps("ssm")}>
            <rect
              x="556" y="246" width="152" height="68"
              fill="var(--surface)" stroke={box("ssm")} strokeWidth="1"
            />
            <text x="570" y="270" className="fill-[var(--text)] font-mono text-[11px]">
              Systems Manager
            </text>
            <text x="570" y="288" className="fill-[var(--faint)] font-mono text-[9px]">
              operator connects
            </text>
            <text x="570" y="302" className="fill-[var(--faint)] font-mono text-[9px]">
              through here
            </text>
          </g>

          {/* igw -> ssm */}
          <path
            d="M 228 272 L 400 272 L 400 330 L 552 300"
            fill="none" stroke="var(--border-strong)" strokeWidth="1"
            markerEnd="url(#arrow-muted)"
          />

          {/* No internet route annotation */}
          <text x="300" y="320" className="fill-[var(--fail)] font-mono text-[10px]">
            private route table: no 0.0.0.0/0
          </text>
          <text x="300" y="340" className="fill-[var(--faint)] font-mono text-[10px]">
            no NAT gateway · no VPC endpoints
          </text>

          <defs>
            <marker
              id="arrow" viewBox="0 0 8 8" refX="7" refY="4"
              markerWidth="6" markerHeight="6" orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--accent)" />
            </marker>
            <marker
              id="arrow-muted" viewBox="0 0 8 8" refX="7" refY="4"
              markerWidth="6" markerHeight="6" orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="var(--border-strong)" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Detail panel — hover or focus a node */}
      <div className="border-t border-border p-4 sm:p-5">
        <p className="eyebrow">{detail.title}</p>
        <p className="mt-2 max-w-[68ch] text-sm leading-relaxed text-muted">
          {detail.body}
        </p>
        <p className="mt-3 font-mono text-[0.625rem] text-faint">
          Hover or tab through the diagram to read each piece.
        </p>
      </div>
    </div>
  );
}
