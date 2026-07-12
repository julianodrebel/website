# Quickstart Validation Guide: Personal Portfolio Website

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11

This guide documents how to validate that the site works end-to-end. It covers local development, production build verification, Lighthouse scoring, and contact form testing. Full implementation details are in `tasks.md` and the `contracts/` directory.

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18 LTS | https://nodejs.org |
| Angular CLI | latest | `npm i -g @angular/cli` |
| Lighthouse CLI | latest | `npm i -g lighthouse` |

---

## Setup

```bash
# Clone / navigate to project
cd drebel-website

# Install dependencies
npm ci

# Verify Angular CLI is available
ng version
```

---

## Scenario 1 — Development Server

**Goal**: Verify the site renders correctly during development.

```bash
ng serve
# Open http://localhost:4200
```

**Expected outcomes**:
- [ ] Home page loads with hero section visible above the fold at 375 px viewport width (DevTools mobile simulation)
- [ ] Dark/light toggle switches theme instantly; theme persists after browser refresh
- [ ] Navigation links route to `/resume`, `/projects`, `/contact` without full page reload
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] Console shows zero errors and zero warnings

---

## Scenario 2 — Production Build + Local Preview

**Goal**: Verify the SSG pre-rendered output before deploying.

```bash
# Build with SSG pre-rendering
ng build --configuration=production

# Preview locally (static server)
npx serve dist/drebel-website/browser -l 8080
# Open http://localhost:8080
```

**Expected outcomes**:
- [ ] `dist/drebel-website/browser/` contains `index.html`, `resume/index.html`, `projects/index.html`, `contact/index.html`, `404/index.html`
- [ ] Each `index.html` contains the correct `<title>`, `<meta name="description">`, and `<link rel="canonical">` in the HTML source (View Source — no JS execution)
- [ ] `dist/drebel-website/browser/assets/data/*.json` files are present
- [ ] Home page `index.html` contains a `<script type="application/ld+json">` block with `Person` schema

---

## Scenario 3 — JavaScript-Disabled Verification

**Goal**: Confirm FR-001 — the site is fully readable without JavaScript.

```bash
# Open http://localhost:8080 in Chrome
# DevTools → Settings → Debugger → Disable JavaScript
```

**Expected outcomes**:
- [ ] All page text content is visible
- [ ] Navigation links (`<a href>`) work and navigate to pre-rendered pages
- [ ] No "Loading..." spinners remain stuck
- [ ] Contact form is visible (will not submit without JS — acceptable)

---

## Scenario 4 — Lighthouse Audit

**Goal**: Confirm all Lighthouse scores ≥ 95 (SC-002).

```bash
# Run against production build preview (port 8080)
lighthouse http://localhost:8080 --output html --output-path ./lighthouse-home.html
lighthouse http://localhost:8080/resume --output html --output-path ./lighthouse-resume.html
lighthouse http://localhost:8080/projects --output html --output-path ./lighthouse-projects.html
lighthouse http://localhost:8080/contact --output html --output-path ./lighthouse-contact.html

# Open reports in browser
start lighthouse-home.html
```

**Expected outcomes**:
- [ ] Performance ≥ 95 on all 4 routes
- [ ] Accessibility ≥ 95 on all 4 routes
- [ ] Best Practices ≥ 95 on all 4 routes
- [ ] SEO ≥ 95 on all 4 routes
- [ ] LCP ≤ 1.5 s on home page (check `Largest Contentful Paint` metric)
- [ ] CLS < 0.1 on all routes (check `Cumulative Layout Shift` metric)

For reference:
- [Routing contract](contracts/routing.md) — expected meta tags per route
- [Data model](data-model.md) — PersonProfile `seo.defaultDescription` ≤ 160 chars

---

## Scenario 5 — Contact Form End-to-End

**Goal**: Confirm a real submission reaches the site owner's inbox (SC-006).

**Prerequisites**: Formspree form ID configured in `environment.prod.ts`.

```bash
# Open http://localhost:8080/contact in browser (dev server also works)
```

**Steps**:
1. Fill in: Name = `"Test Sender"`, Email = `"test@example.com"`, Message = `"This is a test message from quickstart validation."`
2. Verify Submit button is disabled while any field is empty.
3. Click Submit.
4. Observe success banner within 2 seconds.
5. Check site owner's email inbox for Formspree notification.

**Expected outcomes**:
- [ ] Success banner appears within 2 s: `"Message sent! I'll be in touch soon."`
- [ ] Form fields are cleared after success
- [ ] Email received in owner's inbox with sender name, email, and message body
- [ ] GA4 real-time events panel shows a `form_submit` event (requires GA4 configured)

**Error path test**:
1. Disconnect from the internet (or temporarily use an invalid Formspree ID).
2. Submit the form.
3. [ ] Error banner appears: `"Something went wrong. Please try again."`
4. [ ] Form field values are preserved (not cleared)

---

## Scenario 6 — Accessibility Check

**Goal**: Confirm WCAG 2.1 AA compliance (FR-017).

```bash
# Install axe CLI (optional — browser extension also works)
npm i -g @axe-core/cli
axe http://localhost:8080 --exit
axe http://localhost:8080/resume --exit
axe http://localhost:8080/contact --exit
```

**Expected outcomes**:
- [ ] Zero critical or serious axe violations on all routes
- [ ] All form inputs have associated `<label>` elements
- [ ] All images have `alt` attributes (empty `alt=""` for decorative images)
- [ ] Colour contrast ≥ 4.5:1 in both light and dark themes (check with DevTools "Rendering → Emulate CSS media feature prefers-color-scheme")

---

## Scenario 7 — Security Headers

**Goal**: Confirm `public/_headers` is applied (FR-021).

```bash
# After deploying to Cloudflare Pages preview:
curl -I https://<preview-url>/
```

**Expected headers**:
- [ ] `x-frame-options: DENY`
- [ ] `x-content-type-options: nosniff`
- [ ] `referrer-policy: strict-origin-when-cross-origin`
- [ ] `content-security-policy: default-src 'self'; ...`

---

## Scenario 8 — sitemap.xml and robots.txt

**Goal**: Confirm SEO infrastructure is deployed (FR-014).

```bash
curl https://<preview-url>/sitemap.xml
curl https://<preview-url>/robots.txt
```

**Expected outcomes**:
- [ ] `sitemap.xml` is valid XML, lists `/`, `/resume`, `/projects`, `/contact`
- [ ] `robots.txt` contains `Allow: /` and `Sitemap: https://drebel.tech/sitemap.xml`

---

## Deployment to Cloudflare Pages

```bash
# Cloudflare Pages reads these from project settings:
# Build command:    npm run build
# Output directory: dist/drebel-website/browser

# Or via wrangler CLI:
npx wrangler pages deploy dist/drebel-website/browser --project-name=drebel-website
```

After deployment:
- [ ] Custom domain resolves correctly
- [ ] HTTPS enforced (automatic via Cloudflare)
- [ ] All 8 scenarios above pass against the live URL

---

## References

- [Routing & meta tags contract](contracts/routing.md)
- [Formspree integration contract](contracts/formspree.md)
- [Content JSON schemas](contracts/content-schema.md)
- [Data model](data-model.md)
- [Research decisions](research.md)
