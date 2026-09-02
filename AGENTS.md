# AGENTS.md

## Project overview

CV Maker (also branded as Cvoop in the README) is a resume builder. Users can
create and edit resumes in the browser, choose one of the resume templates,
save anonymous resumes locally, sign in to save account resumes, upload an
existing resume for parsing, manage avatar media, and print or export resumes.

The repository is an npm-workspaces monorepo:

- `apps/web` is the Next.js/React App Router frontend.
- `apps/api` is the Fastify API. It owns authentication, resume persistence,
  uploads, parsing, and server-side PDF generation.
- `packages/shared` contains the shared Zod schemas and inferred TypeScript
  types used by the web and API.
- `packages/resume-renderer` contains the resume templates, renderer CSS,
  browser pagination components, and the server rendering entry point used by
  PDF generation.

At a high level, the web app loads or edits resume data, then calls the API
for account-backed operations. Anonymous resume records and local avatar blobs
are kept in browser IndexedDB. Account resumes and metadata are stored by the
API through Prisma/PostgreSQL; uploaded media is handled by the API's storage
integration. The API validates resume data, renders HTML with the shared
renderer, and uses Playwright for PDF output. Authentication uses access JWTs
and refresh-token cookies, with Google authentication also supported.

## Repository structure

- `apps/web/src/app`: App Router routes, layouts, editor, print route, and
  page-local components. Grouped directories such as `(auth)`, `(main)`,
  `(editor)`, and `(print)` are route groups.
- `apps/web/src/api`: typed-ish frontend API wrappers and token handling.
- `apps/web/src/queries`: TanStack React Query query and mutation hooks.
- `apps/web/src/lib`: browser utilities, IndexedDB persistence, defaults, and
  small shared frontend helpers.
- `apps/api/src/modules`: Fastify route modules, services, schemas, and
  repositories grouped by domain (`auth`, `resumes`, `uploads`, `pdf`, and so
  on).
- `apps/api/src/lib`, `config`, and `plugins`: authentication helpers,
  environment loading, and Fastify/Prisma/cookie/CORS setup.
- `apps/api/prisma`: Prisma schema and migrations. Do not edit generated
  Prisma output by hand.
- `packages/shared/src/schemas`: shared Zod request/resume schemas and inferred
  types. Export additions through `packages/shared/src/index.ts` when needed.
- `packages/resume-renderer/src/resume-templates`: template implementations
  (`template1` through `template7`) and their styles/components.
- `packages/resume-renderer/src/pagination`: the browser pagination engine.
  Read `packages/resume-renderer/PAGINATION.md` before changing it.

New frontend code normally belongs under the relevant `apps/web/src/app`
route/component area, `api`, `queries`, `lib`, or provider directory. New API
domain code normally belongs in a new or existing `apps/api/src/modules`
module. Put types or validation genuinely shared by both applications in
`packages/shared`; keep UI-only and database-only types local to their layer.

## Tech stack and commands

The package manager is npm (the repository has `package-lock.json` and npm
workspaces). The web app uses Next.js, React 19, TypeScript, Tailwind CSS 4,
Radix UI, TanStack React Query, React Hook Form, Zod, Jotai, Lexical,
and dnd-kit. The API uses Fastify, Prisma 7 with PostgreSQL, Zod, Playwright,
AWS S3/SES clients, OpenAI/Google GenAI integrations, JWT, and Argon2.

Commands defined by the repository:

```bash
npm install
npm run dev:web
npm run dev:api
npm run build                 # web build
npm run build:renderer
npm run build:all
npm run lint:web
npm run -w apps/web start
npm run -w apps/api prisma:generate
npm run -w apps/api prisma:migrate
npm run -w apps/api prisma:migrate:deploy
```

Deployment/Cloudflare commands also exist as `build:cf:web`, `preview:web`,
`deploy:web`, `deploy:pdf`, and `cf-typegen:web`. The API and shared packages
have build scripts, but there is no root `test`, `typecheck`, or API lint
script. For a focused TypeScript check, use the package compiler directly,
for example `./node_modules/.bin/tsc -p packages/resume-renderer/tsconfig.json
--noEmit`; run the analogous command for `apps/api`, `packages/shared`, or
`apps/web` when appropriate.

The API's environment module requires deployment-specific variables including
database, CORS, cookie/JWT, OAuth, anonymous-fingerprint, and OpenAI settings.
Do not commit secrets or assume a missing environment variable is optional
unless the code says so.

## Architecture and boundaries

- The web owns interaction, form state, browser-only storage, preview UI, and
  access-token refresh orchestration. API calls should go through the existing
  wrappers in `apps/web/src/api` and query/mutation hooks in
  `apps/web/src/queries`.
- Fastify route modules handle HTTP concerns and delegate domain work to
  services and repositories. Prisma access belongs in API repositories/services,
  not in web code or shared packages.
- Shared schemas are the contract boundary. `resumeSchema` is composed from
  schemas for general data, personal info, work experience, education, skills,
  summary, languages, social links, and custom sections. Auth schemas are also
  shared. If a schema changes, search every form, API route/service, persistence
  path, parser, renderer, and migration consumer before changing it.
- Keep request/response shapes and template keys compatible with both clients
  and persisted data. Do not silently widen or rename a public contract.
- Browser-only APIs such as IndexedDB, `window`, DOM measurement, and
  `document.fonts` must stay out of server modules. Secrets and server-only
  storage credentials must stay out of client bundles.

## Frontend conventions

The frontend uses App Router route groups and client components where state,
forms, browser storage, drag-and-drop, DOM measurement, or printing requires
them. Preserve server/client boundaries and add `"use client"` only where
needed. Components are generally PascalCase files; hooks use `use...`; API
modules are lower-case domain files.

Forms use React Hook Form, often with `FormProvider`/`useFormContext` and
`useFieldArray`, with `zodResolver` and the shared schemas. Keep validation in
the shared schema when it is part of the domain contract; do not duplicate a
different version in a component.

TanStack React Query owns server data and mutations. Reuse existing query
keys/hooks and invalidate or update the relevant cache after mutations. The
editor controller distinguishes `source: "local"` from `source: "account"`:
local form changes are debounced into IndexedDB, while account changes are
debounced API mutations and require an active access token. Preserve loading,
empty, not-found, forbidden, and mutation-error states rather than assuming
data is immediately available.

Use existing Tailwind/Radix/CVA utilities and local CSS conventions before
adding styling abstractions. Any CSS affecting font metrics, width, height,
margin, padding, display, columns, or print behavior must be treated as a
possible pagination change; follow the pagination rules below.

## Backend conventions

Fastify routes are registered in `apps/api/src/createServer.ts` under domain
prefixes (`/auth`, `/resumes`, `/uploads`, `/anonymous-resumes`, `/pdf`, and
others). Route handlers parse request bodies with Zod schemas and use services
and repositories for domain and persistence work. Authentication is derived
from bearer access JWTs and refresh/password-reset cookies; protected routes
use the existing authenticated-user helper. Preserve ownership checks when
reading or mutating resumes.

Prisma is configured for PostgreSQL. The `User`, auth/session, `Resume`, and
anonymous quota models are backed by migrations. A database shape change
requires a reviewed Prisma migration and consideration of existing rows and
deploy ordering. Keep environment access in `apps/api/src/config/env.ts` and
do not bypass its required-variable checks.

Uploads and PDF parsing have size/page/quota and authentication concerns.
Preserve multipart limits, authorization, ownership, and cleanup/error
handling when modifying those modules. PDF rendering uses the built renderer
CSS and server-side Playwright, so renderer changes may affect both preview
and exported output.

## Resume domain and pagination (high risk)

Resume data is a structured `ResumeForm`; a resume also has a template key and
media. Local records use IndexedDB (`Resume`, version 4) and may contain a
cropped avatar `Blob`. Account records are persisted in PostgreSQL and account
avatars use uploaded URLs/keys. There are explicit flows for saving a local
resume to an account, anonymous-upload quota/claim/release, import parsing,
template changes, and media changes. Preserve compatibility with already
persisted local and account records.

The pagination engine is a critical subsystem. The main implementation is in
`packages/resume-renderer/src/pagination`:

- `PaginationDocument` wraps the document, supplies the pagination context,
  measures the rendered DOM, and repeatedly reconciles breaks as content or
  revision changes.
- `FullWidthRegion` is one flow. `ColumnsRegion` creates two independent
  float flows in a CSS grid; each column can receive its own breaks. Nested
  `KeepTogether` flows are selected as atomic/deepest flows at a boundary.
- A `FlowBreak` stores `pageNumber`, `flowId`, `marginTop`, and the flow's
  measured `flowTop`. Rendering uses a zero-size floating `page-anchor` and a
  clearing, full-width `flow-breaker`; these are layout mechanisms, not merely
  visual separators.
- The default A4 geometry is `PAGE_WIDTH = 793.7`, `PAGE_HEIGHT = 1122.52`,
  horizontal padding `72`, header/footer `72`, preview gap `16`, and epsilon
  `0.5`. Content height is page height minus header and footer. Break height is
  footer plus gap plus header; page stride is page height plus gap. Keep these
  values consistent when changing geometry.
- Browser measurement uses `getBoundingClientRect`, scale normalization,
  `TreeWalker`/`Range.getClientRects()` for text bottoms, and flow-boundary
  intersection. Measurements are coordinated through the pagination context;
  content growth and shrinkage invalidate/reconcile existing breaks.
- The float breaker uses `clear: both` and a height equal to the break height.
  `z-index`/background mask overlap but do not replace recalculation. Grid
  `h-full` dividers can span a gap because a row may include breaker height.
  Do not fix that consequence with unexplained spacer or margin hacks.
- `PAGINATION.md` documents the current model and limitations. There is also
  an older/parallel paginator under
  `apps/web/src/app/(editor)/components/ResumePreview/PaiginatorNew`; inspect
  its consumers before assuming it is dead code or replacing it.
- Browser preview and print/PDF are not identical: print CSS sets the page
  gap to zero, and `apps/api/src/modules/pdf/pdf.service.ts` applies server
  pagination in Playwright with matching print geometry and font loading.
  The web print route waits for fonts and image decoding before calling
  `window.print()`.

Do not modify layout-related code in isolation if it can affect pagination.
Before changing templates, editor content, measurements, columns, spacing,
typography, page dimensions, page breaks, printing, or PDF export, locate the
pagination entry points, constants, context/hooks, measurement utilities,
break-rendering components, CSS, and all relevant consumers. Preserve the
current pagination model unless the task explicitly requires changing it.

When changing pagination itself, understand the existing algorithm first.
Prefer a targeted correction over a replacement strategy, precise DOM/browser
layout over heuristic height estimates, and existing constants over magic
offsets. Check content growth and shrinkage, one and multiple pages, both
single and multi-column layouts, long text crossing boundaries, consecutive
full-width/column regions, duplicated or missing content, whitespace,
overlapping flows, re-pagination stability, and print/PDF output.

## Editing rules

- Make the smallest coherent change and follow existing abstractions.
- Search all consumers before changing a shared schema, API contract, template
  key, persisted field, or pagination constant.
- Do not add a dependency when the existing stack already solves the problem.
- Do not rewrite unrelated code or use `any`/error suppression to hide a
  TypeScript or lint problem; explain an unavoidable exception.
- Reuse existing constants, helpers, query-key factories, schemas, and hooks.
- Preserve backwards compatibility for persisted resume data and local
  IndexedDB records.
- Keep server secrets and browser-only behavior on their correct side of the
  boundary.
- For every frontend change that can alter rendered dimensions or document
  flow, explicitly evaluate pagination before considering the task complete.

## Verification checklist

Run the narrowest relevant checks, then broader checks when practical:

- TypeScript: package-specific `tsc` checks, especially shared, API, and
  renderer when their sources change.
- Frontend: `npm run lint:web` and `npm run build:web` for web changes.
- API/shared/renderer: their existing `npm run build` scripts where affected;
  there is no repository test suite configured, so do not claim tests passed
  when none were run.
- Data contracts: validate schema changes through all forms, API routes,
  parser/import paths, renderer/server rendering, and persisted-record cases.
- Database: review generated Prisma SQL and migration ordering; use
  `prisma:migrate` locally and `prisma:migrate:deploy` only for deployment
  workflows.
- Integration: check local/account loading and saving, auth refresh/ownership,
  upload/media paths, and API/frontend response compatibility as applicable.
- Pagination: manually inspect preview and print/PDF for any change to
  rendered dimensions, editor content, page layout, columns, typography,
  spacing, or export behavior. Include one-page/multi-page and long-content
  cases.

## High-risk areas

Treat authentication/session cookies and ownership checks, shared resume
schemas, local/account synchronization, Prisma migrations, uploads/media,
PDF parsing, server PDF rendering, and the pagination/layout engine as
high-risk. In particular, small CSS, DOM, typography, Lexical/editor, or
measurement changes can shift page breaks throughout a resume.

## Investigation workflow

Before changing code:

1. Locate the route/component/service or renderer entry point.
2. Trace its callers, consumers, query keys, and server/client boundary.
3. Inspect shared schemas/types and the local/account persistence paths.
4. For layout work, read `PAGINATION.md` and trace browser and PDF consumers.
5. Check API, database, migration, upload, and compatibility implications.
6. Make the smallest coherent change and run the relevant verification checks.

There are currently no nested `AGENTS.md`, `CLAUDE.md`, Copilot, or Cursor
instruction files. Add a nested instruction file only if a subdirectory later
develops genuinely different conventions.
