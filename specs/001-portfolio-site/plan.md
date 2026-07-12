# Implementation Plan: Personal Portfolio Website

**Branch**: `001-portfolio-site` | **Date**: 2026-07-11 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/001-portfolio-site/spec.md`

## Summary

Build a fully pre-rendered (SSG) personal portfolio site in Angular deployed on Cloudflare Pages. The site serves as a professional landing page, interactive online resume, and contact hub for recruiters and freelance clients. All content is stored in JSON files in `src/assets/data/`; no CMS or backend server is required. The contact form delegates email delivery to Formspree. Performance is a hard constraint: Lighthouse ≥ 95, LCP ≤ 1.5 s, bundle < 200 KB gzipped.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode) · Angular latest stable (≥ 18) — exact version pinned at project scaffolding time

**Primary Dependencies**: `@angular/core`, `@angular/router`, `@angular/common/http` (JSON content), `@angular/platform-server` + `@angular/build` (SSG pre-rendering), `rxjs`

**Storage**: Static JSON files in `src/assets/data/` served as assets — no database, no CMS

**Testing**: Karma + Jasmine (Angular default unit tests) · Lighthouse CLI (performance gate) · axe-core (accessibility gate)

**Target Platform**: Static HTML/CSS/JS deployed on Cloudflare Pages global CDN; must be fully readable without JavaScript (SSG pre-render)

**Project Type**: SSG web application (single-page Angular app with build-time pre-rendering)

**Performance Goals**: Lighthouse ≥ 95 (all 4 categories) · LCP ≤ 1.5 s on simulated 4G · CLS < 0.1 · gzipped JS bundle < 200 KB (excluding images)

**Constraints**: No backend server · Cloudflare Pages build limits (CPU: 15 min, size: 25 MB) · Formspree free tier (50 submissions/month) · content updates via git commit only

**Scale/Scope**: 4 pre-rendered routes + 404 page · ~15 Angular components · single developer · low traffic (< 1000 visits/month initially)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Gate Question | Status |
|-----------|---------------|--------|
| I. Performance First | SSG pre-rendering ensures content in initial HTML; lazy loading applied per route; images in WebP; bundle split by route | ✅ PASS |
| I. Performance First | Bundle size target < 200 KB gzipped enforced by Lighthouse CI gate in build | ✅ PASS |
| II. Minimalism & Clarity | Design tokens defined in `_tokens.scss` as CSS custom properties; single source of truth | ✅ PASS |
| II. Minimalism & Clarity | No decorative animations — only fade-in on scroll and state-change transitions | ✅ PASS |
| III. SEO & Discoverability | Every route has unique title + meta + canonical + OG tags in pre-rendered HTML via Angular `Meta`/`Title` services | ✅ PASS |
| III. SEO & Discoverability | `sitemap.xml` generated at build time; `robots.txt` in `public/` | ✅ PASS |
| III. SEO & Discoverability | JSON-LD `Person` schema on home page; `CreativeWork` on project cards | ✅ PASS |
| IV. Professional UX | Dark/light toggle reads `prefers-color-scheme` on first load; persists to `localStorage['theme-preference']` | ✅ PASS |
| IV. Professional UX | WCAG 2.1 AA: contrast ≥ 4.5:1 confirmed in both themes via color tokens; all interactive elements keyboard-accessible | ✅ PASS |
| V. Maintainability | Content in `src/assets/data/*.json` — zero hardcoded data in component classes | ✅ PASS |
| V. Maintainability | TypeScript `strict: true` in `tsconfig.json`; ESLint + Prettier in CI | ✅ PASS |
| V. Maintainability | Unit test coverage ≥ 60% for ThemeService, ContactFormComponent, ContentService | ✅ PASS |

**Post-design re-check (Phase 1)**: All gates still pass — see contracts and data model for evidence.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-site/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── routing.md       # URL routes, page titles, meta tags contract
│   ├── content-schema.md # JSON data file schemas
│   └── formspree.md     # Contact form submission contract
└── tasks.md             # Phase 2 output (/speckit.tasks — NOT created here)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── content.service.ts     # HTTP-based JSON asset loader
│   │       ├── theme.service.ts       # dark/light BehaviorSubject + localStorage
│   │       └── analytics.service.ts  # GA4 event wrapper
│   ├── shared/
│   │   └── components/
│   │       ├── button/                # ButtonComponent
│   │       ├── tag/                   # TagComponent (skill/tech badge)
│   │       ├── form-field/            # FormFieldComponent (label + input + error)
│   │       └── icon/                  # IconComponent (inline SVG)
│   ├── features/
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   ├── home.component.html
│   │   │   └── home.component.scss
│   │   ├── resume/
│   │   │   ├── resume.component.ts
│   │   │   ├── resume.component.html
│   │   │   └── resume.component.scss
│   │   ├── projects/
│   │   │   ├── projects.component.ts
│   │   │   ├── projects.component.html
│   │   │   └── projects.component.scss
│   │   ├── contact/
│   │   │   ├── contact.component.ts
│   │   │   ├── contact.component.html
│   │   │   └── contact.component.scss
│   │   └── not-found/
│   │       └── not-found.component.ts
│   ├── layout/
│   │   ├── header/
│   │   │   ├── header.component.ts
│   │   │   ├── header.component.html
│   │   │   └── header.component.scss
│   │   └── footer/
│   │       ├── footer.component.ts
│   │       └── footer.component.html
│   ├── styles/
│   │   ├── _tokens.scss       # CSS custom property definitions (colors, spacing, type)
│   │   ├── _reset.scss        # Minimal CSS reset
│   │   ├── _typography.scss   # Base heading and body styles
│   │   ├── _animations.scss   # Reusable keyframes + transition utilities
│   │   └── global.scss        # @forward all partials
│   ├── app.component.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── assets/
│   ├── data/
│   │   ├── profile.json       # PersonProfile (name, headline, summary, social links)
│   │   ├── skills.json        # SkillCategory[]
│   │   ├── experience.json    # ExperienceEntry[]
│   │   └── projects.json      # Project[]
│   └── images/
│       ├── og-image.png       # 1200×630 Open Graph image
│       └── favicon.svg
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── index.html

public/
├── robots.txt
├── sitemap.xml
└── _headers               # Cloudflare Pages security headers

angular.json
tsconfig.json
tsconfig.spec.json
.eslintrc.json
.prettierrc
wrangler.toml
```

**Structure Decision**: Single Angular project (no monorepo). Standalone components throughout — no NgModules except the root `AppComponent`. Features are lazy-loaded route components. Shared UI components live in `src/app/shared/components/`. Core services (content, theme, analytics) live in `src/app/core/services/` and are provided at root level.

## Complexity Tracking

No constitution violations requiring justification.
