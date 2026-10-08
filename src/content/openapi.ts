/**
 * OpenAPI description of the Job Application Assistant API.
 *
 * Written by reading the Express routers in `server/src/routes/` — the paths,
 * status codes, Zod-validated request bodies and response shapes below all
 * correspond to code that exists. It is a hand-maintained document, not
 * generated from the source, so it can drift: if a route changes, change this
 * too.
 */

export type HttpMethod = "GET" | "POST";

export type Endpoint = {
  method: HttpMethod;
  path: string;
  summary: string;
  /** Requires the session cookie. */
  auth: boolean;
  description: string;
  requestBody?: { contentType: string; example: string };
  responses: { status: number; meaning: string; example?: string }[];
};

export type EndpointGroup = {
  name: string;
  blurb: string;
  endpoints: Endpoint[];
};

const userExample = `{
  "user": {
    "id": 1,
    "email": "you@example.com",
    "createdAt": "2026-10-08T09:12:44.000Z"
  }
}`;

const analysisExample = `{
  "analysis": {
    "id": 42,
    "resumeId": 7,
    "jobDescriptionId": 19,
    "fitScore": 85,
    "createdAt": "2026-10-08T09:20:01.000Z",
    "result": {
      "fitScore": 85,
      "summary": "Strong overlap on backend and multi-tenant work; no container experience.",
      "matchedSkills": [
        {
          "skill": "TypeScript across frontend and backend",
          "importance": "critical",
          "evidence": "TypeScript strict mode across services and React UI."
        }
      ],
      "missingSkills": [
        { "skill": "Containerised deployment", "importance": "important" }
      ],
      "bulletSuggestions": ["..."],
      "coverLetter": "...",
      "scoreBreakdown": {
        "earnedWeight": 17,
        "totalWeight": 20,
        "weights": { "critical": 3, "important": 2, "nice_to_have": 1 }
      }
    }
  }
}`;

export const API_BASE = "/api";

export const apiGroups: readonly EndpointGroup[] = [
  {
    name: "Health",
    blurb: "Unauthenticated liveness check.",
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        summary: "Service liveness",
        auth: false,
        description:
          "Returns a static payload plus a timestamp. Used by the client to confirm the two apps are wired together.",
        responses: [
          {
            status: 200,
            meaning: "Service is up",
            example: `{
  "status": "ok",
  "message": "Job Application Assistant API is running",
  "timestamp": "2026-10-08T09:12:44.000Z"
}`,
          },
        ],
      },
    ],
  },
  {
    name: "Auth",
    blurb:
      "Session cookie, httpOnly and Secure in production. Credentials are bcrypt-hashed; a failed login costs the same time whether or not the email exists.",
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/register",
        summary: "Create an account and sign in",
        auth: false,
        description:
          "Password must be at least 8 characters and at most 72 bytes — measured in bytes, because bcrypt ignores anything past 72 and multi-byte characters reach that limit sooner than the character count suggests.",
        requestBody: {
          contentType: "application/json",
          example: `{
  "email": "you@example.com",
  "password": "correct horse battery"
}`,
        },
        responses: [
          { status: 201, meaning: "Account created, session cookie set", example: userExample },
          { status: 400, meaning: "Validation failed — returns a { field: message } map" },
          { status: 409, meaning: "Email already registered" },
        ],
      },
      {
        method: "POST",
        path: "/api/auth/login",
        summary: "Exchange credentials for a session",
        auth: false,
        description:
          "A wrong email and a wrong password return an identical 401, so the response cannot be used to enumerate which accounts exist.",
        requestBody: {
          contentType: "application/json",
          example: `{
  "email": "you@example.com",
  "password": "correct horse battery"
}`,
        },
        responses: [
          { status: 200, meaning: "Signed in", example: userExample },
          { status: 401, meaning: "Invalid email or password" },
        ],
      },
      {
        method: "POST",
        path: "/api/auth/logout",
        summary: "Clear the session cookie",
        auth: false,
        description:
          "Always 204, whether or not a session was present. The clear options must match those the cookie was set with, or the browser keeps the original.",
        responses: [{ status: 204, meaning: "Cookie cleared" }],
      },
      {
        method: "GET",
        path: "/api/auth/me",
        summary: "The signed-in user",
        auth: true,
        description: "How the client restores a session on page load.",
        responses: [
          { status: 200, meaning: "Current user", example: userExample },
          { status: 401, meaning: "Session is invalid or has expired" },
        ],
      },
    ],
  },
  {
    name: "Resumes",
    blurb:
      "Every route is user-scoped. A resume belonging to someone else is a 404, never a 403 — the existence of the record is itself private.",
    endpoints: [
      {
        method: "POST",
        path: "/api/resumes",
        summary: "Upload a resume and extract its text",
        auth: true,
        description:
          "Accepts PDF and DOCX. The file is parsed on upload and only the extracted text is stored — the original is never persisted.",
        requestBody: {
          contentType: "multipart/form-data",
          example: `file: <resume.pdf | resume.docx>`,
        },
        responses: [
          {
            status: 201,
            meaning: "Stored",
            example: `{
  "resume": {
    "id": 7,
    "originalFilename": "resume.pdf",
    "characterCount": 4821,
    "createdAt": "2026-10-08T09:15:00.000Z"
  }
}`,
          },
          { status: 400, meaning: "Unsupported file type, or no text could be extracted" },
          { status: 401, meaning: "Not signed in" },
        ],
      },
      {
        method: "GET",
        path: "/api/resumes",
        summary: "List your uploads, newest first",
        auth: true,
        description: "Summaries only — the extracted text is not included.",
        responses: [
          {
            status: 200,
            meaning: "Your resumes",
            example: `{
  "resumes": [
    {
      "id": 7,
      "originalFilename": "resume.pdf",
      "characterCount": 4821,
      "createdAt": "2026-10-08T09:15:00.000Z"
    }
  ]
}`,
          },
        ],
      },
      {
        method: "GET",
        path: "/api/resumes/{id}",
        summary: "One resume, including its extracted text",
        auth: true,
        description: "Scoped to the caller. Another user's id returns 404.",
        responses: [
          { status: 200, meaning: "The resume with `extractedText`" },
          { status: 404, meaning: "Not found, or not yours" },
        ],
      },
    ],
  },
  {
    name: "Analyses",
    blurb:
      "The scoring endpoint. The model classifies each requirement; the service computes the weighted score — so the number reconciles with the matched and missing lists beside it.",
    endpoints: [
      {
        method: "POST",
        path: "/api/analyses",
        summary: "Score a resume against a job description",
        auth: true,
        description:
          "The resume is loaded through the user-scoped lookup first, so a resumeId belonging to someone else is a 404 before any model call is made — an unauthorized request must never cost a Gemini request. The posting must be 100–30,000 characters; anything shorter is almost certainly a title pasted without the body, which would produce a confidently useless analysis.",
        requestBody: {
          contentType: "application/json",
          example: `{
  "resumeId": 7,
  "jobDescription": "We are looking for a full-stack engineer..."
}`,
        },
        responses: [
          { status: 201, meaning: "Analysis stored", example: analysisExample },
          { status: 400, meaning: "Job description too short or too long" },
          { status: 404, meaning: "Resume not found, or not yours" },
        ],
      },
      {
        method: "GET",
        path: "/api/analyses",
        summary: "Your analysis history, newest first",
        auth: true,
        description:
          "Paginated with `limit` (1–100, default 20) and `offset` (default 0). The cap exists so a hand-written query string cannot ask for the whole table.",
        responses: [
          {
            status: 200,
            meaning: "History page",
            example: `{
  "analyses": [
    {
      "id": 42,
      "fitScore": 85,
      "createdAt": "2026-10-08T09:20:01.000Z",
      "resumeFilename": "resume.pdf",
      "jobTitle": "Full-Stack Engineer"
    }
  ],
  "total": 1
}`,
          },
          { status: 400, meaning: "Invalid pagination parameters" },
        ],
      },
      {
        method: "GET",
        path: "/api/analyses/{id}",
        summary: "Reopen a stored analysis",
        auth: true,
        description: "Returns the full stored result, including the score breakdown.",
        responses: [
          { status: 200, meaning: "The analysis", example: analysisExample },
          { status: 404, meaning: "Not found, or not yours" },
        ],
      },
    ],
  },
];
