<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR: initial constitution establishment from template)
Modified principles: none (all new)
Added sections:
  - Core Principles (I–V)
  - Technical Architecture & Constraints
  - Development Workflow & Quality Gates
  - Governance
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ no changes required (generic enough)
  - .specify/templates/spec-template.md ✅ no changes required (generic enough)
  - .specify/templates/tasks-template.md ✅ no changes required (generic enough)
Follow-up TODOs: none — all placeholders resolved.
-->

# drebel-website Constitution

## Core Principles

### I. Performance First (NON-NEGOTIABLE)

Every build artifact, component, and route MUST meet Core Web Vitals thresholds:
LCP < 2.5s, FID < 100ms, CLS < 0.1. Lighthouse score MUST be ≥ 95 across all
categories (Performance, Accessibility, Best Practices, SEO).

- Lazy loading MUST be applied to all routes and heavy components.
- Code splitting MUST be configured via Angular's built-in SSG/pre-rendering pipeline.
- Images MUST be served in WebP format with appropriate fallbacks.
- Gzipped bundle size (excluding assets) MUST remain below 200 KB.
- CSS critical path MUST be inlined; non-critical CSS MUST be deferred.
- Fonts MUST use the system stack or be loaded with `font-display: swap`.

Rationale: The site's primary audience is recruiters and clients who judge quality
on first impression. Slow pages create negative bias before any content is read.

### II. Minimalism and Clarity

Every visual element, animation, and interaction MUST serve a clear functional
purpose. Decorative complexity is prohibited.

- Typography, spacing, and color tokens MUST be defined as design tokens in a
  single source of truth (CSS custom properties or Tailwind config).
- Animations and transitions MUST be subtle and purposeful (no looping or
  attention-grabbing effects unrelated to state changes).
- Navigation depth MUST NOT exceed 3 clicks to reach any content.
- Components MUST be named and scoped to express their single responsibility.

Rationale: A minimal, focused presentation communicates professionalism and
respect for the visitor's attention.

### III. SEO and Discoverability

Every page MUST be statically pre-rendered and discoverable by search engines.

- Each route MUST have unique `<title>`, `<meta name="description">`, and Open
  Graph tags managed via Angular's `Meta` and `Title` services.
- `sitemap.xml` MUST be generated as part of the build pipeline.
- `robots.txt` MUST be present and permissive for indexing.
- Structured data (JSON-LD, schema.org `Person` + `CreativeWork`) MUST be
  included on Home and Project pages.
- Canonical `<link rel="canonical">` tags MUST be present on all pages.

Rationale: Organic discovery by recruiters searching for skills or projects is
a primary acquisition channel; without it the site is invisible.

### IV. Professional User Experience

The site MUST deliver a consistent, accessible, and responsive experience across
all devices and user preferences.

- Dark mode and Light mode MUST be supported; initial value MUST follow
  `prefers-color-scheme`; user override MUST be persisted in `localStorage`.
- The layout MUST be mobile-first and fully functional from 320 px viewport width.
- Keyboard navigation MUST be fully functional (focus-visible, skip-links).
- WCAG 2.1 AA compliance is the minimum; contrast ratio MUST be ≥ 4.5:1 for
  normal text and ≥ 3:1 for large text.
- ARIA labels MUST be added to all interactive elements that lack visible text.
- The contact form MUST validate inputs client-side and surface clear feedback
  within 2 seconds of submission.

Rationale: Accessibility is both an ethical obligation and a quality signal; an
inaccessible portfolio undermines the professional brand it is meant to build.

### V. Maintainability and Scalability

The codebase MUST be structured so that content updates and feature additions
require minimal effort and zero architectural changes.

- All portfolio content (projects, experience, skills) MUST be stored in
  Markdown files with YAML front-matter; no hardcoded data in component classes.
- The Angular project MUST follow a module/feature-based folder structure:
  `layout/`, `pages/`, `components/`, `services/`, `styles/`.
- TypeScript strict mode (`strict: true`) MUST be enabled in `tsconfig.json`.
- ESLint (Angular preset) and Prettier MUST be configured and enforced in CI.
- Commit messages MUST follow `[type](scope): description` format.
- Unit test coverage for critical components (routing, markdown parsing, theme
  toggle, contact form) MUST be ≥ 60 %.

Rationale: The site will evolve as the owner's career progresses; maintainability
ensures updates remain low-friction indefinitely.

## Technical Architecture and Constraints

### Stack

- **Framework**: Angular (latest stable) with SSG via `@angular/build` pre-rendering.
- **Styling**: CSS3 with BEM methodology and CSS custom properties for theming.
  Tailwind CSS is an accepted alternative if adopted from project start.
- **Content**: Markdown files with YAML front-matter parsed at build time.
- **Analytics**: Cloudflare Analytics Engine (preferred) or Google Analytics.
- **Deploy**: Cloudflare Pages — build command `npm run build`, output directory `dist/`.
- **Contact form backend**: Cloudflare Workers, Formspree, or equivalent serverless
  handler. A custom backend server is explicitly out of scope.

### Folder Structure

```text
src/
├── app/
│   ├── layout/         # Header, Footer, Navigation components
│   ├── pages/          # Home, Projects, Resume, Blog, Contact, NotFound
│   ├── components/     # Reusable UI components
│   ├── services/       # Data fetching, markdown parsing, theme service
│   └── styles/         # Global styles, design tokens, themes
├── assets/
│   ├── projects/       # Project markdown + images
│   ├── blog/           # Blog post markdown
│   └── images/         # Logos, favicons, hero images
├── environments/       # Environment configs (analytics IDs, form endpoints)
└── index.html
wrangler.toml           # Cloudflare Pages configuration
angular.json            # outputHashing, minification, SSG routes
tsconfig.json           # strict: true
```

### Mandatory Pages

| Page | Purpose |
|------|---------|
| Home | Personal introduction + CTA to projects/contact |
| Projects | Filterable gallery (by technology, year) |
| Resume | Experience timeline + skills |
| Contact | Validated form with submission feedback |
| 404 | Custom error page |
| Blog | Optional; deferred to a later release |

### Naming Conventions

- **Components**: PascalCase file names with `.component.ts` suffix.
- **Services**: PascalCase with `.service.ts` suffix.
- **CSS classes**: kebab-case, BEM notation (`block__element--modifier`).
- **Branches**: `main` (production), `develop` (staging), `feature/*`, `hotfix/*`.

### Markdown Front-Matter Schema

```yaml
---
title: "Project Title"
description: "One-sentence description"
tags: ["Angular", "TypeScript"]
date: "YYYY-MM-DD"
featured: true
link: "https://github.com/..."
---
```

### Security Headers (Cloudflare Pages)

The following headers MUST be configured via `_headers` file or wrangler config:

- `Content-Security-Policy` — restrictive policy scoped to trusted origins.
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

HTTPS is enforced automatically by Cloudflare; no additional configuration required.

## Development Workflow and Quality Gates

### Commit Message Format

```
[type](scope): description
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`.

Example: `[feat](projects): add project filtering by technology`

### Quality Gate Checklist (per PR)

- [ ] TypeScript compiles with zero errors (`tsc --noEmit`).
- [ ] ESLint passes with zero errors.
- [ ] Prettier formatting applied.
- [ ] Lighthouse CI score ≥ 95 on preview deployment.
- [ ] No `console.error` or `console.warn` output in production build.
- [ ] New components have ≥ 60 % unit test coverage.
- [ ] All new pages include meta tags and canonical links.

### Performance Checklist (pre-launch)

- [ ] Lighthouse ≥ 95 all categories.
- [ ] FCP < 1.5s on simulated 4G.
- [ ] Gzipped JS bundle < 200 KB.
- [ ] All images in WebP with `width`/`height` attributes set.
- [ ] No render-blocking resources.

## Governance

This constitution supersedes all other project conventions. Any practice that
conflicts with a principle stated here MUST be resolved in favour of the
constitution.

**Amendment procedure**:
1. Open a PR with proposed changes to `.specify/memory/constitution.md`.
2. State the version bump type (MAJOR/MINOR/PATCH) and justification.
3. Update dependent templates if sections are added or removed.
4. Merge requires explicit owner approval.

**Versioning policy**: Semantic versioning (`MAJOR.MINOR.PATCH`).
- MAJOR: principle removal or backward-incompatible redefinition.
- MINOR: new principle or materially expanded guidance.
- PATCH: clarifications, wording fixes, non-semantic refinements.

**Compliance review**: Verified on every PR via the Quality Gate Checklist above.
Deviations require documented rationale in the PR description.

**Version**: 1.0.0 | **Ratified**: 2026-07-11 | **Last Amended**: 2026-07-11
