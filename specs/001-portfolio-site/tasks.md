---
description: "Task list for Personal Portfolio Website (drebel-website)"
---

# Tasks: Personal Portfolio Website

**Feature**: `001-portfolio-site`
**Input**: Design documents from `specs/001-portfolio-site/`
**Prerequisites**: plan.md ✅ · spec.md ✅ · research.md ✅ · data-model.md ✅ · contracts/ ✅ · quickstart.md ✅
**Tests**: Unit tests included for constitution-mandated critical components (ThemeService, ContentService, ContactComponent — ≥ 60% coverage per constitution §V).

## Format: `[ID] [P?] [Story?] Description — file path`

- **[P]**: Parallelisable (independent files, no dependency on incomplete tasks in same phase)
- **[USn]**: User story from spec.md (US1–US8)
- All paths relative to repository root

---

## Phase 1: Setup

**Purpose**: Scaffold the Angular project, configure tooling, and prepare build infrastructure. Must be complete before any code is written.

**Independent test**: `ng version` succeeds, `npm run lint` passes with zero errors, `npm run build` produces a `dist/` directory.

- [X] T001 Scaffold Angular project with `ng new drebel-website --routing --style=scss --ssr` and verify angular.json has `@angular/build` as the builder — `angular.json`, `package.json`
- [X] T002 Enable TypeScript strict mode: set `strict: true`, `strictNullChecks: true`, `noImplicitAny: true`, `noImplicitReturns: true` in `tsconfig.json`
- [X] T003 [P] Configure ESLint with `angular-eslint` preset: install `@angular-eslint/eslint-plugin` and create `.eslintrc.json`
- [X] T004 [P] Configure Prettier: create `.prettierrc` with `singleQuote: true`, `semi: false`, `printWidth: 100`, `trailingComma: "es5"`
- [X] T005 [P] Create `src/environments/environment.ts` and `src/environments/environment.prod.ts` with `formspreeId`, `ga4MeasurementId`, and `siteUrl` fields per `specs/001-portfolio-site/contracts/content-schema.md`
- [X] T006 [P] Create `routes.txt` at project root listing `/`, `/resume`, `/projects`, `/contact`, `/404` (one per line) as required by `@angular/build` prerender
- [X] T007 [P] Update `angular.json`: set `prerender.routesFile` to `routes.txt`, configure `outputHashing: "all"`, add bundle size budgets (error at 500 KB initial, warning at 300 KB)

---

## Phase 2: Foundational

**Purpose**: Core infrastructure — TypeScript types, design tokens, services, routing, and shared UI components — that every user story depends on. Must be complete before any feature phase begins.

**Independent test**: `ng build` succeeds with no type errors; `ng serve` renders a blank shell page at `localhost:4200` with no console errors; `data-theme` attribute on `<html>` matches system preference on first load.

- [X] T008 Create content type interfaces in `src/app/shared/types/content.types.ts`: `PersonProfile`, `SocialLink`, `SkillCategory`, `ExperienceEntry`, `Project`, `ContactSubmission`, `Theme` — exactly as defined in `specs/001-portfolio-site/data-model.md`
- [X] T009 Create SCSS design system partials in `src/app/styles/`: `_tokens.scss` (CSS custom properties for both `[data-theme="light"]` and `[data-theme="dark"]` per `specs/001-portfolio-site/PLAN_PROMPT.md` palette), `_reset.scss`, `_typography.scss`, `_animations.scss`, and `global.scss` that `@forward`s all partials; register `global.scss` in `angular.json` styles array
- [X] T010 Implement `ThemeService` in `src/app/core/services/theme.service.ts`: `BehaviorSubject<Theme>`, `toggleTheme()`, `getThemePreference()` (reads `localStorage['theme-preference']` then `prefers-color-scheme`), `applyTheme()` (sets `data-theme` on `document.documentElement`)
- [X] T011 Add FOUC-prevention inline `<script>` to `src/index.html` `<head>`: reads `localStorage['theme-preference']`, falls back to `prefers-color-scheme`, sets `document.documentElement.setAttribute('data-theme', value)` before Angular bootstraps
- [X] T012 Implement `ContentService` in `src/app/core/services/content.service.ts`: `profile$`, `skills$`, `experience$` (sorted descending by `startYear`), `projects$` — all via `HttpClient.get<T>('assets/data/*.json')` per `specs/001-portfolio-site/contracts/content-schema.md`
- [X] T013 Configure `src/app/app.routes.ts` with lazy-loaded child routes (`HomeComponent`, `ResumeComponent`, `ProjectsComponent`, `ContactComponent`, `NotFoundComponent`, `**` → `/404`) per `specs/001-portfolio-site/contracts/routing.md`; configure `src/app/app.config.ts` with `provideRouter(routes)`, `provideHttpClient()`, `provideClientHydration()`
- [X] T014 [P] Create placeholder JSON data files in `src/assets/data/`: `profile.json`, `skills.json`, `experience.json`, `projects.json` — each with 2–3 sample entries matching the schemas in `specs/001-portfolio-site/data-model.md`
- [X] T015 [P] Create `TagComponent` in `src/app/shared/components/tag/tag.component.ts`: accepts `@Input() label: string` and `@Input() interactive = false`; emits `@Output() selected` when `interactive`; BEM class `tag`, `tag--interactive`
- [X] T016 [P] Create `ButtonComponent` in `src/app/shared/components/button/button.component.ts`: accepts `@Input() variant: 'primary' | 'secondary' = 'primary'`, `@Input() disabled = false`, `@Input() type: 'button' | 'submit' = 'button'`; minimum 40×40 px tap target
- [X] T017 [P] Create `FormFieldComponent` in `src/app/shared/components/form-field/form-field.component.ts`: wraps `<label>` + projected `<input>`/`<textarea>` + error message; links error via `aria-describedby`; accepts `@Input() errorMessage: string | null`
- [X] T018 [P] Create `IconComponent` in `src/app/shared/components/icon/icon.component.ts`: accepts `@Input() name: string` (e.g. `'linkedin'`, `'sun'`, `'moon'`, `'menu'`, `'close'`); renders inline SVG; sets `aria-hidden="true"` by default; accepts `@Input() ariaLabel?: string`

---

## Phase 3: US5 — Site-Wide Navigation & Layout

**Story goal**: Every page has a sticky header with logo, nav links, and theme toggle; a footer with social links and copyright; and a working mobile hamburger menu. All keyboard-accessible.

**Independent test**: Deploy the shell page (no content) and verify: sticky header is visible at 375 px, hamburger opens/closes, Escape closes the menu and returns focus, theme toggle switches theme, footer is visible; axe reports zero violations.

- [X] T019 [US5] Create `AppComponent` shell in `src/app/app.component.ts` + template: `<a class="skip-link" href="#main-content">Skip to content</a>`, `<app-header>`, `<main id="main-content"><router-outlet></router-outlet></main>`, `<app-footer>`; subscribe to `ThemeService` and call `applyTheme()` on init
- [X] T020 [US5] Implement `HeaderComponent` in `src/app/layout/header/header.component.ts` + `.html` + `.scss`: sticky (`position: sticky; top: 0`), site logo linking to `/`, nav links (Home, Currículo, Projetos, Contato) with `routerLinkActive` adding `nav-link--active` class and `aria-current="page"`, theme toggle using `IconComponent` (sun/moon), min tap target 40×40 px
- [X] T021 [US5] Add mobile hamburger menu to `HeaderComponent`: hamburger `<button>` visible below 640 px (`aria-label="Open menu"`, `aria-expanded` bound to `menuOpen`), slide-in nav overlay, Escape keydown handler that closes menu and returns `focus()` to trigger button, close on nav link click, ARIA `role="dialog"` on overlay — `src/app/layout/header/header.component.ts`
- [X] T022 [US5] Implement `FooterComponent` in `src/app/layout/footer/footer.component.ts` + `.html`: LinkedIn link via `IconComponent` (aria-label "LinkedIn profile"), copyright notice `© {year} {name}`, privacy policy text link; styled with BEM in `src/app/layout/footer/footer.component.scss`

---

## Phase 4: US1 — Home Page

**Story goal**: A recruiter opens the site and immediately sees name, headline, summary, and CTA above the fold on a 375 px screen. Theme toggle works. Page is pre-rendered with correct meta tags.

**Independent test**: `curl` the pre-rendered `index.html` and verify title, description, OG tags, canonical, and JSON-LD `Person` block are present; open at 375 px and confirm hero is above the fold with zero console errors.

- [X] T023 [P] [US1] Build `HomeComponent` in `src/app/features/home/home.component.ts`: load `PersonProfile` from `ContentService.profile$`; render hero section with name, headline, summary, CTA `<a routerLink="/resume">` (`ButtonComponent` variant="primary"), social links list using `IconComponent`
- [X] T024 [P] [US1] Style `HomeComponent` hero section in `src/app/features/home/home.component.scss`: mobile-first, hero visible above fold at 375 px viewport (`min-height: 100svh` or `100vh`), CTA button meets 40×40 px tap target, all colours use `var(--color-*)` tokens
- [X] T025 [US1] Set page meta tags in `HomeComponent.ngOnInit` in `src/app/features/home/home.component.ts`: `Title.setTitle()`, `Meta.updateTag()` for `description`, `og:title`, `og:description`, `og:image`, `og:url`, `og:type`; add `<link rel="canonical">` via `DOCUMENT` injection — per `specs/001-portfolio-site/contracts/routing.md`
- [X] T026 [US1] Inject JSON-LD `Person` schema in `HomeComponent.ngOnInit` in `src/app/features/home/home.component.ts`: create `<script type="application/ld+json">` element, populate with `PersonProfile` data (name, jobTitle, url, sameAs, worksFor) per `specs/001-portfolio-site/contracts/routing.md`, append to `document.head`
- [X] T027 [US1] Add keyboard focus order to `HomeComponent` template: skip-link target `#main-content`, logical Tab order (hero → CTA → social links), visible focus rings via `:focus-visible` in `src/app/features/home/home.component.scss`

---

## Phase 5: US2 — Resume Review

**Story goal**: A recruiter views `/resume` and can read the professional summary, scan skill badges grouped by category, and follow the experience timeline from most-recent to oldest. Fully readable on mobile.

**Independent test**: Populate `skills.json` and `experience.json` with 3 categories and 3 experience entries; open `/resume` at 375 px and confirm no horizontal overflow, entries are in descending order, skill badges are visible; `curl` verifies meta tags contain "resume"/"experience"/"skills".

- [X] T028 [US2] Build `ResumeComponent` in `src/app/features/resume/resume.component.ts`: load `PersonProfile` (summary), `SkillCategory[]`, `ExperienceEntry[]` from `ContentService`; render professional summary paragraph; render skills grid (category heading + `TagComponent` badges per item); render experience timeline (`<ol>` with semantic `<li>` entries)
- [X] T029 [P] [US2] Style skills grid in `src/app/features/resume/resume.component.scss`: responsive grid (1 col mobile → 2 col tablet → 3 col desktop), category cards with `var(--color-bg-secondary)` background, `TagComponent` badges with accent colour, min 40×40 px tap area
- [X] T030 [P] [US2] Style experience timeline in `src/app/features/resume/resume.component.scss`: vertical connector line (CSS `::before` pseudo-element), year badge, company/role heading, description paragraph; mobile single-column, no horizontal overflow at 320 px
- [X] T031 [US2] Set page meta tags in `ResumeComponent.ngOnInit` in `src/app/features/resume/resume.component.ts`: title `"Resume — {headline} | {name}"`, description includes "resume"/"experience"/"skills", canonical, OG tags — per `specs/001-portfolio-site/contracts/routing.md`
- [X] T032 [US2] Add ARIA semantics to resume page in `src/app/features/resume/resume.component.html`: `<section aria-labelledby>` for each section, `<ol>` for timeline entries with `<time datetime>` for years, screen-reader-friendly experience entries

---

## Phase 6: US3 — Contact Submission

**Story goal**: A visitor fills in name, email, and message; submits; sees a success banner within 2 seconds; the owner receives an email via Formspree. Validation errors appear on blur. Spam is silently discarded via honeypot.

**Independent test**: Configure a real Formspree ID in `environment.ts`; submit valid form; verify success banner and email delivery. Submit with honeypot filled; verify submission is discarded. Submit with JS disabled; verify form is visible.

- [X] T033 [US3] Implement `ContactComponent` reactive form in `src/app/features/contact/contact.component.ts`: `FormGroup` with `name` (required, minLength 2), `email` (required, email pattern), `message` (required, minLength 10), `_gotcha` (default `''`); show inline errors on blur via `FormFieldComponent`; disable Submit `ButtonComponent` when `formGroup.invalid` or `submitting === true`
- [X] T034 [US3] Implement Formspree POST in `ContactComponent` (`src/app/features/contact/contact.component.ts`): `HttpClient.post(environment.formspreeId, formValue, { headers: { Accept: 'application/json' } })`; on success → show `aria-live="polite"` success banner, reset fields; on error → show error banner, preserve fields, re-enable Submit; per `specs/001-portfolio-site/contracts/formspree.md`
- [X] T035 [US3] Add honeypot field to `ContactComponent` template in `src/app/features/contact/contact.component.html`: `<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">` bound to `_gotcha` control
- [X] T036 [US3] Style `ContactComponent` in `src/app/features/contact/contact.component.scss`: mobile-first form layout, all inputs `font-size: 1rem` (≥ 16 px, prevents iOS auto-zoom), labels above inputs, error messages in accent/error colour, success/error banners with ARIA `role="status"` / `role="alert"`
- [X] T037 [US3] Set page meta tags in `ContactComponent.ngOnInit` in `src/app/features/contact/contact.component.ts`: title, description, canonical, OG tags — per `specs/001-portfolio-site/contracts/routing.md`

---

## Phase 7: US7 — SEO & Structured Data

**Story goal**: `sitemap.xml` and `robots.txt` are deployed and reachable. Breadcrumb JSON-LD is present on `/resume`, `/projects`, and `/contact`. Every page title and meta tag is verified in pre-rendered HTML.

**Independent test**: `curl /sitemap.xml` returns valid XML with all 4 routes; `curl /robots.txt` returns `Allow: /` and sitemap reference; fetch pre-rendered HTML of each page without JS and confirm all meta tags from `specs/001-portfolio-site/contracts/routing.md` are present.

- [X] T038 [US7] Create `public/robots.txt`: `User-agent: *`, `Allow: /`, `Sitemap: https://drebel.tech/sitemap.xml`, `Disallow: /404`
- [X] T039 [US7] Create `public/sitemap.xml`: valid XML sitemap with `<url>` entries for `/`, `/resume`, `/projects`, `/contact`; `<changefreq>monthly</changefreq>`, `<priority>` values (1.0 home, 0.9 resume, 0.8 projects/contact)
- [X] T040 [US7] Add breadcrumb JSON-LD to `ResumeComponent`, `ProjectsComponent`, and `ContactComponent` `ngOnInit` in their respective `src/app/features/*/` component files: `BreadcrumbList` schema with `Home → {Page Name}` structure per schema.org

---

## Phase 8: US6 — Performance & Core Web Vitals

**Story goal**: Production build passes all performance gates: Lighthouse ≥ 95 on all 4 categories for all routes, LCP ≤ 1.5 s, CLS < 0.1, gzipped bundle < 200 KB.

**Independent test**: Run `ng build --configuration=production`; verify 5 pre-rendered `index.html` files exist; run Lighthouse CLI against all routes; confirm all scores ≥ 95 and bundle size < 200 KB.

- [X] T041 [US6] Run `ng build --configuration=production` and verify `dist/drebel-website/browser/` contains pre-rendered `index.html` for `/`, `/resume`, `/projects`, `/contact`, `/404`; fix any build errors before proceeding
- [X] T042 [P] [US6] Create `src/assets/images/og-image.png` (1200×630 px, < 200 KB) and `src/assets/images/favicon.svg`; add `<link rel="icon">` to `src/index.html`; reference `og-image.png` in all OG meta tags
- [X] T043 [P] [US6] Audit all `<img>` tags across all components: set explicit `width` and `height` attributes, add `loading="lazy"` to below-fold images, ensure `alt` text is present or `alt=""` for decorative images — CLS prevention
- [X] T044 [US6] Run Lighthouse CLI (`lighthouse http://localhost:4200 --output json`) against all 4 routes; document scores in a comment block at the top of `specs/001-portfolio-site/quickstart.md`; fix any issues blocking ≥ 95 scores

---

## Phase 9: US4 — Projects Gallery

**Story goal**: A visitor sees a grid of project cards (title, description, tech tags — no repo links) and can filter by technology tag without a page reload. Cards fade in as they enter the viewport.

**Independent test**: Populate `projects.json` with 5 entries across 3 technologies; open `/projects` at 375 px, 768 px, and 1024 px; verify responsive grid; click a technology filter and verify only matching cards are visible; confirm no repository links in the rendered HTML.

- [X] T045 [US4] Build `ProjectsComponent` card grid in `src/app/features/projects/projects.component.ts`: load `Project[]` from `ContentService.projects$`; maintain `activeFilter$: BehaviorSubject<string | null>`; derive `filteredProjects$` by combining with `activeFilter$`; render `TagComponent` filter buttons for all unique technologies
- [X] T046 [P] [US4] Build project card template in `src/app/features/projects/projects.component.html`: each card shows `title`, `description`, tech `TagComponent` badges; **no `href` or link to source code**; add `aria-label` on card for screen readers
- [X] T047 [P] [US4] Style `ProjectsComponent` in `src/app/features/projects/projects.component.scss`: responsive CSS Grid (`grid-template-columns: 1fr` → `repeat(2, 1fr)` → `repeat(3, 1fr)`), card hover shadow transition using `var(--shadow-md)`, filter buttons row wraps on mobile
- [X] T048 [P] [US4] Add `IntersectionObserver` fade-in to project cards in `src/app/features/projects/projects.component.ts`: observe each card; add `.card--visible` class when entry `isIntersecting`; CSS transition from `opacity: 0` to `opacity: 1` in `_animations.scss`
- [X] T049 [US4] Set page meta tags in `ProjectsComponent.ngOnInit` in `src/app/features/projects/projects.component.ts`: title, description, canonical, OG tags — per `specs/001-portfolio-site/contracts/routing.md`

---

## Phase 10: US8 — Analytics Integration

**Story goal**: GA4 fires a `page_view` event on every route change and a `form_submit` event on successful contact submissions. No PII is sent. A privacy policy disclosure is linked in the footer.

**Independent test**: Configure real GA4 ID; open the site, navigate to all pages, submit the contact form; verify events appear in GA4 real-time view within 30 seconds; inspect network requests and confirm no email/name/message in event parameters.

- [X] T050 [US8] Add GA4 `gtag.js` loader to `src/index.html` `<head>`: `<script async src="https://www.googletagmanager.com/gtag/js?id={ga4MeasurementId}">` and inline init script; use `environment.ga4MeasurementId`; set `anonymize_ip: true`, `ads_data_redection: true`
- [X] T051 [P] [US8] Implement `AnalyticsService` in `src/app/core/services/analytics.service.ts`: `trackPageView(path: string)` and `trackEvent(eventName: string, params?: Record<string, unknown>)` wrappers around `window.gtag`; no-op safely if `gtag` is undefined (SSR/test environments)
- [X] T052 [P] [US8] Wire `AnalyticsService.trackPageView` to `Router` events in `src/app/app.component.ts`: subscribe to `NavigationEnd`, call `trackPageView(event.urlAfterRedirects)`
- [X] T053 [US8] Call `AnalyticsService.trackEvent('form_submit', { form_id: 'contact' })` in `ContactComponent` success handler in `src/app/features/contact/contact.component.ts`
- [X] T054 [US8] Update `FooterComponent` in `src/app/layout/footer/footer.component.html`: add privacy policy inline text or link disclosing GA4 data collection and Formspree form processing

---

## Phase 11: Polish & Cross-Cutting

**Purpose**: 404 page, security headers, critical unit tests, and final validation. No new user-facing features.

**Independent test**: Navigate to `/nonexistent-path` and see the custom 404 page; run `axe` against all routes with zero critical violations; run `npm test` with ≥ 60% coverage on ThemeService, ContentService, ContactComponent; verify `_headers` file is served correctly by Cloudflare preview.

- [X] T055 Implement `NotFoundComponent` in `src/app/features/not-found/not-found.component.ts`: display "404 — Page not found" message with a link back to `/`; set `meta[name="robots"] content="noindex"` in `ngOnInit`
- [X] T056 Create `public/_headers` with Cloudflare Pages security headers per `specs/001-portfolio-site/research.md` RES-007: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy` allowlist
- [X] T057 [P] Write `ThemeService` unit tests in `src/app/core/services/theme.service.spec.ts`: test `getThemePreference()` with saved value, without saved value (media query mock), `toggleTheme()` updates BehaviorSubject and localStorage, `applyTheme()` sets `data-theme` attribute — ≥ 60% coverage
- [X] T058 [P] Write `ContentService` unit tests in `src/app/core/services/content.service.spec.ts`: mock `HttpClient`, verify `experience$` returns entries sorted descending by `startYear`, verify `profile$` emits typed `PersonProfile` — ≥ 60% coverage
- [X] T059 [P] Write `ContactComponent` unit tests in `src/app/features/contact/contact.component.spec.ts`: test form invalid when empty, valid with correct data, Submit disabled when invalid, `_gotcha` defaults to `''`, error banner shown on HTTP error, success banner shown on HTTP 200 — ≥ 60% coverage
- [ ] T060 Run complete manual validation checklist in `specs/001-portfolio-site/quickstart.md` Scenarios 1–8; confirm all checkboxes pass; document any Lighthouse scores < 95 and resolve before marking complete

---

## Dependency Graph

```
Phase 1 (Setup)
  └─► Phase 2 (Foundational)
        └─► Phase 3 (US5 · Navigation)
              ├─► Phase 4 (US1 · Home)
              ├─► Phase 5 (US2 · Resume)
              ├─► Phase 6 (US3 · Contact)
              └─► Phase 7 (US7 · SEO)
                    └─► Phase 8 (US6 · Performance ← gate)
                          ├─► Phase 9  (US4 · Projects)
                          └─► Phase 10 (US8 · Analytics)
                                └─► Phase 11 (Polish)
```

**Phases 4, 5, 6 are independent** — they can be implemented in parallel once Phase 3 is complete.

---

## Parallel Execution Examples

### After Phase 3 is complete, implement these stories in parallel:

**Developer A** → Phase 4 (US1 Home): T023 → T024 (parallel) → T025 → T026 → T027  
**Developer B** → Phase 5 (US2 Resume): T028 → T029 + T030 (parallel) → T031 → T032  
**Developer C** → Phase 6 (US3 Contact): T033 → T034 → T035 → T036 → T037

### Within Phase 2 (Foundational), these tasks run in parallel:

T015, T016, T017, T018 (shared UI components — independent files)  
T009, T010, T011 (SCSS partials — independent files after T009 creates _tokens.scss)

### Within Phase 9 (US4 Projects), these tasks run in parallel:

T046, T047, T048 (card template, styles, and IntersectionObserver — once T045 creates the component)

---

## Implementation Strategy

**MVP scope** (Phases 1–3 + Phase 4): Scaffold + Foundational + Navigation + Home Page. This alone demonstrates the performance-first architecture, dark/light theme, SSG pre-render, and meta tags — enough for a soft launch.

**Full P1 scope** (Phases 1–8): Complete site with resume, contact, SEO infrastructure, and performance gate. Ready for public launch.

**P2 additions** (Phases 9–10): Projects gallery and analytics. Add after launch or alongside P1 work.

**Polish** (Phase 11): Unit tests and security headers complete the constitution compliance requirements.
