# Research: Personal Portfolio Website

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11 | **Status**: Complete — 0 NEEDS CLARIFICATION items remain

---

## RES-001 · Content Storage Format — JSON vs Markdown

**Decision**: Use **JSON files** in `src/assets/data/` as the content format.

**Rationale**:
- Angular's `HttpClient` can load JSON assets directly with strong TypeScript typing — no parsing library needed.
- Markdown requires either a build-time parser (adds tooling complexity) or a runtime parser (adds bundle weight). For structured data such as skill lists and experience entries, JSON is more natural.
- The constitution requires *content separated from component code* and *no hardcoded data in component classes* — JSON in `assets/data/` satisfies both.
- Updates remain a simple git commit to a `.json` file; no CMS is required.

**Alternatives considered**:
- Markdown with YAML front-matter — rejected for structured data (skills, experience) because Markdown's text-body format adds no value over JSON for these entity types; reserved as an option for future long-form blog posts.
- Headless CMS (Contentful, Sanity) — rejected; adds external dependency, cost, and build complexity for a single-developer personal site.

---

## RES-002 · Angular SSG Pre-rendering Strategy

**Decision**: Use Angular's built-in **`@angular/build` SSG with `prerender: true`** and an explicit `routesToRender` list.

**Rationale**:
- Angular ≥ 17 ships `@angular/build` (formerly `@angular-devkit/build-angular`) with native SSR/SSG support via `ng build --prerender` or by setting `prerender: true` in `angular.json`.
- Explicit route list (`/`, `/resume`, `/projects`, `/contact`, `/404`) ensures deterministic output without dynamic route discovery.
- The pre-rendered HTML satisfies FR-001 (readable without JS) and the SEO gates.
- Cloudflare Pages serves static assets from its CDN — no SSR runtime is needed.

**`angular.json` key config**:
```json
"prerender": {
  "routesFile": "routes.txt"
}
```

**`routes.txt`** (project root):
```
/
/resume
/projects
/contact
/404
```

**Alternatives considered**:
- Angular Universal with Express — rejected; requires a Node.js server; Cloudflare Pages is a static-only host in this project.
- Scully (Angular SSG library) — rejected; superseded by Angular's built-in SSG which now covers the same use cases without an extra dependency.

---

## RES-003 · Contact Form Backend

**Decision**: Use **Formspree** (free tier) as the email delivery service.

**Rationale**:
- Formspree provides a `POST https://formspree.io/f/{id}` endpoint that accepts JSON, sends an email to the owner, and returns a JSON response — zero server-side code required.
- The honeypot field (`_gotcha`) is a built-in Formspree convention that silently discards spam submissions.
- Formspree's free tier (50 submissions/month) is adequate for initial launch traffic.
- CSRF protection is handled by Formspree's origin-checking; no token management is needed client-side.

**Integration approach** (Angular `ContactService`):
```typescript
// POST { name, email, message } to formspree endpoint
// Accept: 'application/json' header required
// On 200 → show success state
// On 4xx/5xx → show error banner, preserve field values
```

**Rate limiting**: Formspree enforces per-form rate limits. Angular-side duplicate submission prevention: disable Submit button on first click; re-enable only on error response.

**Alternatives considered**:
- Cloudflare Workers email — more capable but requires Workers configuration and a verified email sender; overkill for an MVP contact form.
- `mailto:` link — rejected; opens native mail client, poor UX on mobile and does not track submissions in analytics.
- Netlify Forms — rejected; the project deploys to Cloudflare Pages, not Netlify.

---

## RES-004 · CSS Strategy — Custom Properties vs Tailwind

**Decision**: Use **CSS custom properties (`var()`) with BEM** defined in `src/app/styles/_tokens.scss`, compiled via Angular's SCSS pipeline.

**Rationale**:
- CSS custom properties natively support runtime theme switching (dark/light) without re-rendering — the theme toggle just updates `data-theme` on `<html>` and the browser re-evaluates all `var()` tokens instantly.
- Zero runtime JS for theming; no Flash of Unstyled Content.
- BEM class naming keeps component SCSS encapsulated and legible without utility-class proliferation.
- No extra dependency; Angular CLI processes SCSS out of the box.
- Bundle size: no Tailwind CSS purge step needed; SCSS compiles to minimal CSS.

**Token structure**:
```scss
// _tokens.scss
:root[data-theme="light"] {
  --color-bg-primary:    #FFFFFF;
  --color-bg-secondary:  #F5F5F5;
  --color-text-primary:  #1A1A1A;
  --color-text-secondary:#666666;
  --color-accent:        #0066CC;
  --color-border:        #E0E0E0;
}
:root[data-theme="dark"] {
  --color-bg-primary:    #0A0E27;
  --color-bg-secondary:  #14192A;
  --color-text-primary:  #FFFFFF;
  --color-text-secondary:#B0B0B0;
  --color-accent:        #4D94FF;
  --color-border:        #2A3A5A;
}
```

**Theme initialisation** (avoid FOUC):
```html
<!-- index.html <head> — inline script to apply theme before first paint -->
<script>
  const t = localStorage.getItem('theme-preference') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
</script>
```

**Alternatives considered**:
- Tailwind CSS — acceptable (constitution permits it) but adds a config file, JIT build step, and class-name verbosity in templates; CSS custom properties are simpler for a single-developer site.
- Angular CDK theming / Angular Material — rejected; full Material design is too opinionated for a minimal custom portfolio.

---

## RES-005 · Analytics Implementation

**Decision**: Use **Google Analytics 4 (GA4)** loaded via an inline `<script>` tag in `index.html`, with a lightweight `AnalyticsService` wrapper for event tracking.

**Rationale**:
- GA4 is the industry standard; provides page_view, custom events, and goal conversion tracking (contact form submission).
- Loading via `index.html` script tag (not a separate npm package) keeps bundle size down.
- `AnalyticsService` wraps `window.gtag()` calls behind an interface, enabling easy swap-out or disabling in tests.
- Cloudflare Analytics (passive CDN logs) is available automatically at zero cost; no Angular integration needed.

**Privacy compliance**:
- GA4 is configured with `anonymize_ip: true` and `ads_data_redaction: true`.
- A privacy policy page (or `/privacy` inline content) discloses data collection.
- No cookie banner is required for Cloudflare Analytics (no personal data); GA4 requires a banner under GDPR if targeting EU visitors — this is deferred to post-launch.

**Alternatives considered**:
- `angular-google-analytics` npm package — adds bundle weight; raw gtag is sufficient.
- Plausible Analytics — privacy-friendly but paid; deferred for consideration post-launch.

---

## RES-006 · i18n — Deferred

**Decision**: **Defer i18n (pt-BR + en-US) to a future release.**

**Rationale**:
- The spec does not include i18n as a functional requirement (FR-001–FR-021).
- Adding `@angular/localize` and a second locale doubles the build output and complexity without a validated user need.
- Content files (JSON) can be structured with a locale key later without architectural changes.
- The owner's target audience (Brazilian recruiters + international clients) will be addressed by writing content in English — a bilingual toggle is a P3 enhancement.

---

## RES-007 · Security Headers (Cloudflare Pages `_headers`)

**Decision**: Deliver all security headers via a `public/_headers` file — Cloudflare Pages reads this file and applies headers globally.

**Rationale**:
- No server-side middleware required; `_headers` is a Cloudflare Pages convention.
- Covers all constitution-mandated headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`.
- CSP is set to a restrictive allowlist: `default-src 'self'`; `script-src` adds `'unsafe-inline'` only for the FOUC-prevention inline script (SHA-based nonce is a Phase 2 hardening).

**`_headers` file**:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://formspree.io https://www.google-analytics.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'
```

---

## Summary Table

| ID | Topic | Decision |
|----|-------|---------|
| RES-001 | Content format | JSON files in `src/assets/data/` |
| RES-002 | Angular SSG | `@angular/build` prerender with `routes.txt` |
| RES-003 | Contact form | Formspree free tier |
| RES-004 | CSS/theming | CSS custom properties + BEM + SCSS tokens |
| RES-005 | Analytics | GA4 via inline `<script>` + AnalyticsService |
| RES-006 | i18n | Deferred (out of scope for v1) |
| RES-007 | Security headers | Cloudflare Pages `public/_headers` |
