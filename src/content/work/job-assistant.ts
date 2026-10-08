import { caseStudySchema } from "@/lib/schemas";

export const jobAssistant = caseStudySchema.parse({
  slug: "job-assistant",
  title: "Making an LLM feature testable by not asking it for the answer",
  org: "Personal project",
  period: "2026",
  summary:
    "A full-stack app that scores a resume against a job description. The model classifies each requirement; application code computes the score. That split is what makes the output reproducible, unit-testable, and explainable to the person reading it.",
  tags: ["Node.js", "Express", "TypeScript", "React", "PostgreSQL", "AWS", "Zod"],

  screenshots: [
    {
      src: "/screens/new-analysis.jpg",
      caption: "Pasting a job description against a stored resume.",
    },
    {
      src: "/screens/analysis-result.jpg",
      caption:
        "The score with its working shown — weighted coverage, and matched against missing requirements side by side.",
    },
    {
      src: "/screens/analysis-suggestions.jpg",
      caption: "Tailored bullet suggestions and the cover letter draft.",
    },
    {
      src: "/screens/history.jpg",
      caption: "Private per-user history of previous analyses.",
    },
  ],

  owned: "A full-stack side project — API, React client, PostgreSQL schema and the AWS it runs on.",
  hardPart: "Making output from a model reproducible enough to unit-test and explain to the user.",
  result: "Deterministic scoring covered by 64 tests that run offline, with no model call in the suite.",

  context:
    "Applying for roles means reading a job description, working out which of its requirements you actually meet, and rewriting your resume to say so. The mechanical part of that is the same every time, which makes it worth automating — and it is a genuinely useful test case for building a feature on a model you do not control.",

  constraint:
    "A fit score that changes between two runs on identical input is not a score, it is a mood. The output had to be stable enough to test and explainable enough that a user can see why a number came out the way it did. The model also sits behind a free-tier quota that returns 429s without warning, so the system had to behave sensibly when the model was slow, rate-limited, or returned something that was not valid JSON.",

  built: [
    "Full-stack app — Node.js/Express/TypeScript API, React/Vite/Tailwind frontend — returning matched vs. missing skills, tailored bullet suggestions and a cover letter draft.",
    "Text extraction from PDF and DOCX uploads.",
    "Private per-user history, with JWT sessions in httpOnly cookies and bcrypt-hashed credentials.",
    "A deterministic scoring layer: the LLM classifies each requirement's importance and whether the resume matches it; application code computes the weighted score from those classifications.",
    "Zod validation of every model response before it reaches scoring code, with retry-with-backoff on transient 429 and 503 responses.",
    "64 automated tests covering the scoring maths independently of the model.",
    "AWS infrastructure: RDS PostgreSQL across two private subnets with no internet route, reached through an SSM-managed EC2 bastion with zero inbound security-group rules.",
  ],

  decisions: [
    {
      decision:
        "Ask the model to classify; compute the score in application code.",
      rejected: "Asking the model for a fit score directly.",
      why: "A number from a model cannot be unit-tested — there is nothing to assert beyond a range, and it drifts when the model changes. Classification per requirement is a bounded judgement the model is good at, and once I have those labels the score is arithmetic: deterministic, testable without a single API call, and explainable line by line to the person reading it. Almost all of the 64 tests exist because of this one split.",
    },
    {
      decision: "Validate every model response with Zod before using it.",
      rejected: "Parsing the JSON and trusting its shape.",
      why: "Model output is untrusted input that happens to usually be well-formed. Without a schema at the boundary, a missing field becomes undefined, flows into the weighted sum and produces a confidently wrong number. With one, it is a caught error at the edge that can be retried — the difference between a visible failure and a silent one.",
    },
    {
      decision:
        "Put RDS in private subnets with no internet route and reach it through SSM Session Manager.",
      rejected: "A public database endpoint, or a bastion host with SSH on port 22.",
      why: "A security group allowing 22 from anywhere is the thing that gets scanned, and a key is a long-lived credential that has to live somewhere — including, eventually, in CI. Session Manager needs no inbound rule at all: access is an IAM decision, it is logged, and there is no key to leak or rotate. The database keeps no route to the internet in either direction.",
    },
    {
      decision: "No NAT gateway.",
      rejected: "A NAT gateway for outbound access from the private subnets.",
      why: "A NAT gateway is roughly $32 a month and the database has no reason to make outbound connections. Leaving it out removed a standing cost and an egress path at the same time. It is worth saying out loud because the default VPC diagram everyone copies includes one.",
    },
  ],

  outcome: [
    "Scoring is reproducible on identical input and covered by 64 tests that run without touching the model.",
    "Malformed model output fails at the validation boundary and is retried, instead of propagating into the score.",
    "The database has no route to the internet, and there is no SSH key in existence for the bastion.",
    "Runs on free-tier-sized infrastructure with no NAT gateway.",
  ],

  wouldChange:
    "The scoring weights are constants in code. They should be a versioned config stored with each result, so a saved score records the weights it was computed under — otherwise tuning the weights silently changes the meaning of every score already in a user's history. I would also cache classifications per requirement, since re-scoring against a similar job description re-asks the model questions it has already answered.",
});
