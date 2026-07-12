# Feature Specification: Personal Portfolio Website

**Feature Branch**: `001-portfolio-site`

**Created**: 2026-07-11

**Status**: Draft

**Input**: Complete personal portfolio site — professional landing page, online resume, projects showcase, contact form, dark/light theme, SEO, analytics, mobile-first responsiveness, and Core Web Vitals optimisation. Angular + TypeScript, deployed on Cloudflare Pages (SSG). Target audience: recruiters, companies, and freelance clients.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — First Impression: Home Page (Priority: P1)

A recruiter or potential client lands on the site for the first time. Without scrolling they can read the owner's name, professional headline ("Sênior Software Developer"), a two-sentence summary, and a clear call-to-action button. Navigation links are immediately visible and the dark/light mode toggle is reachable in one click.

**Why this priority**: The home page is the entry point for every visitor and the primary conversion funnel. If it fails to load fast or communicate clearly, no other feature gets seen.

**Independent Test**: Deploy just the home page with hardcoded data — a recruiter can open it and within 5 seconds understand who the person is and how to take the next step.

**Acceptance Scenarios**:

1. **Given** a recruiter opens the site URL, **When** the page finishes loading, **Then** the hero section with name, headline, summary, and CTA button are visible without scrolling on a 375 px mobile screen.
2. **Given** the page is loaded, **When** a visitor clicks the CTA button ("Ver Currículo"), **Then** they are navigated to `/resume` without a full page reload.
3. **Given** the system default theme is dark, **When** the visitor clicks the theme toggle, **Then** the colour scheme switches to light in under 300 ms and the preference is saved for future visits.
4. **Given** a keyboard-only user, **When** they press Tab, **Then** focus moves through: skip-link → logo → nav links → CTA → social links → theme toggle, in logical order with visible focus rings.
5. **Given** a search engine crawler, **When** it fetches the home page, **Then** the `<title>`, `<meta name="description">`, and Open Graph tags are present in the pre-rendered HTML.

---

### User Story 2 — Resume Review (Priority: P1)

A recruiter navigates to `/resume` to evaluate the candidate's background. They can scan the professional summary, see skills grouped by category with visual badges, and read the experience timeline ordered from most recent to oldest. The page loads without additional network requests beyond the initial SSG HTML.

**Why this priority**: The resume page is the primary decision-making artifact for hiring. It is tied with the home page as the most business-critical deliverable.

**Independent Test**: The resume page can be deployed independently as a static HTML page with sample data and verified by a recruiter without any other pages existing.

**Acceptance Scenarios**:

1. **Given** a recruiter is on `/resume`, **When** they scan the page, **Then** professional summary, skill badges grouped by category (Frontend, Backend, DevOps), and experience entries are all visible.
2. **Given** multiple experience entries exist, **When** the page renders, **Then** entries are ordered with the most recent at the top (descending by start year).
3. **Given** a mobile user on a 375 px screen, **When** they view skill categories, **Then** each category renders as a readable card without horizontal overflow or collapsed content.
4. **Given** a screen reader user, **When** they navigate the experience timeline, **Then** each entry is announced with company name, role, years, and description in logical order.
5. **Given** a search engine crawler, **When** it fetches `/resume`, **Then** the page title includes "resume", "experience", and "skills" in the `<meta>` tags.

---

### User Story 3 — Contact Submission (Priority: P1)

A recruiter or client navigates to `/contact`, fills in their name, email, and message, and submits the form. They receive visual confirmation within 2 seconds. The site owner receives an email notification via Formspree.

**Why this priority**: Contact is the conversion goal of the entire site. A non-functional contact form means zero inbound leads.

**Independent Test**: The contact page can be deployed in isolation with a real Formspree endpoint and verified by sending a test message end-to-end.

**Acceptance Scenarios**:

1. **Given** a visitor is on `/contact`, **When** they submit a valid form (name ≥ 2 chars, valid email, message ≥ 10 chars), **Then** a success message appears within 2 seconds and the form fields are cleared.
2. **Given** a visitor submits with an invalid email, **When** they blur the email field, **Then** an error message appears adjacent to the field before they attempt to submit.
3. **Given** a visitor clicks Submit with an incomplete form, **When** validation fails, **Then** the Submit button remains disabled and all invalid fields show inline error messages.
4. **Given** Formspree returns an error, **When** submission fails, **Then** an error banner is displayed and no field values are lost, allowing the user to retry.
5. **Given** a spambot submits the form with the honeypot field filled, **When** the form is processed, **Then** the submission is silently discarded.
6. **Given** a keyboard-only user on the form, **When** they Tab through fields and press Enter on Submit, **Then** the form submits correctly with proper ARIA live region announcements.

---

### User Story 4 — Projects Gallery (Priority: P2)

A visitor navigates to `/projects` to browse the owner's work. They see project cards with generic titles, descriptions, and technology tags. They can filter cards by technology tag. No source code links or sensitive repository details are exposed.

**Why this priority**: Projects provide credibility evidence, but the site is functional without them. Filtering is a nice-to-have within this page.

**Independent Test**: The projects page can be deployed with 3–5 hardcoded project entries and a visitor can filter them by technology tag, verifying that only matching cards remain visible.

**Acceptance Scenarios**:

1. **Given** a visitor is on `/projects`, **When** the page renders, **Then** each project card shows title, generic description, and technology tags — no repository URLs or code links.
2. **Given** multiple technology tags exist, **When** a visitor clicks a technology filter button, **Then** only cards containing that technology are displayed without a page reload.
3. **Given** a mobile user, **When** they view the projects grid, **Then** it collapses from 3 columns (desktop) to 2 (tablet) to 1 (mobile) without overflow.
4. **Given** a card enters the viewport while scrolling, **When** the intersection observer fires, **Then** the card fades in smoothly.

---

### User Story 5 — Site-Wide Navigation & Layout (Priority: P1)

A visitor on any page can see a sticky header with the site logo, navigation links, and the theme toggle. On mobile, a hamburger menu replaces the horizontal nav links. The footer is visible on all pages with social links and copyright notice.

**Why this priority**: Navigation is load-bearing infrastructure — without it, no other page is reachable. It must be complete before any page can be considered production-ready.

**Independent Test**: A single-page shell with header and footer (no content) demonstrates correct sticky behaviour, mobile hamburger menu, keyboard nav, and theme toggle.

**Acceptance Scenarios**:

1. **Given** a visitor scrolls down on any page, **When** content moves behind the header, **Then** the header remains fixed at the top and does not obscure interactive content below.
2. **Given** a visitor is on `/resume`, **When** the header renders, **Then** the "Currículo" nav link is visually marked as active.
3. **Given** a mobile user (< 640 px viewport), **When** they tap the hamburger button, **Then** a slide-in menu opens with all navigation links, and closes when a link is selected or Escape is pressed.
4. **Given** a keyboard user, **When** they press Escape while the mobile menu is open, **Then** the menu closes and focus returns to the hamburger button.
5. **Given** any page loads, **When** the footer renders, **Then** the LinkedIn link, copyright notice, and privacy policy link are present.

---

### User Story 6 — Performance & Core Web Vitals (Priority: P1)

The site is pre-rendered at build time. All pages pass Core Web Vitals thresholds on a simulated slow 4G connection: LCP < 2.5s, FID/INP < 200ms, CLS < 0.1. Lighthouse scores ≥ 95 on all categories.

**Why this priority**: Performance is a constitution-level constraint. A slow site undermines the professional brand and directly impacts SEO ranking.

**Independent Test**: Run Lighthouse CI against a preview deployment and confirm all scores ≥ 95 before merging to main.

**Acceptance Scenarios**:

1. **Given** the production build is deployed, **When** Lighthouse CI runs against each route (`/`, `/resume`, `/projects`, `/contact`), **Then** all scores are ≥ 95.
2. **Given** the home page, **When** WebPageTest measures LCP on simulated 4G, **Then** LCP ≤ 1.5s.
3. **Given** all pages, **When** the gzipped JS bundle size is measured, **Then** it is below 200 KB (excluding image assets).
4. **Given** images exist on the page, **When** they are requested, **Then** WebP variants are served with `width` and `height` attributes set to prevent layout shift.

---

### User Story 7 — SEO & Structured Data (Priority: P1)

Each page has unique, pre-rendered meta tags. The home page includes JSON-LD `Person` schema. `sitemap.xml` and `robots.txt` are reachable. A search engine can fully index the site within 7 days of launch.

**Why this priority**: SEO is a primary acquisition channel for the target audience (recruiters searching by skill). Constitution mandates it.

**Independent Test**: Fetch the pre-rendered HTML of each page and verify meta tags, canonical links, and JSON-LD are present in the raw source without JavaScript execution.

**Acceptance Scenarios**:

1. **Given** any page is fetched without JavaScript, **When** the HTML source is inspected, **Then** `<title>`, `<meta name="description">`, `og:title`, `og:description`, `og:image`, and `<link rel="canonical">` are all present.
2. **Given** a GET request to `/sitemap.xml`, **When** the server responds, **Then** it returns a valid XML sitemap listing all public routes.
3. **Given** a GET request to `/robots.txt`, **When** the server responds, **Then** it allows crawling of all public pages and references the sitemap URL.
4. **Given** the home page, **When** validated against schema.org validator, **Then** the JSON-LD `Person` structured data passes without errors.
5. **Given** the Lighthouse SEO audit runs, **When** it completes, **Then** the score is ≥ 95.

---

### User Story 8 — Analytics Integration (Priority: P2)

The site owner can view visitor statistics, page views, and contact form submission events in a Google Analytics 4 dashboard. No personally identifiable information beyond standard GA4 events is collected.

**Why this priority**: Analytics is not required for the MVP launch but provides valuable data immediately after. It should be in place before the site goes public.

**Independent Test**: Deploy with GA4 configured, visit several pages, submit the contact form, and verify events appear in the GA4 real-time view within 30 seconds.

**Acceptance Scenarios**:

1. **Given** a visitor loads any page, **When** GA4 initialises, **Then** a `page_view` event is recorded with the correct page path.
2. **Given** a visitor submits the contact form successfully, **When** GA4 processes the event, **Then** a `form_submit` event with `form_id: "contact"` is recorded.
3. **Given** the GA4 data stream, **When** it is inspected, **Then** no email addresses, names, or message contents are present in any event parameters.
4. **Given** a privacy policy link in the footer, **When** a visitor clicks it, **Then** a page describing data collection practices is displayed.

---

### Edge Cases

- What happens when the visitor has JavaScript disabled? Pre-rendered SSG HTML MUST be fully readable; navigation links MUST work as standard `<a>` tags.
- What happens when the Formspree endpoint is unreachable? The form MUST display a persistent error banner and preserve all field values so the user can retry.
- What happens when `prefers-color-scheme` is not supported (older browser)? The default theme MUST be light (safe fallback).
- What happens when a project has no technology tags? The card MUST still render without a tag section, and technology filters MUST not break.
- What happens when the viewport is exactly 320 px wide? No horizontal scrollbar MUST appear on any page.
- What happens when the user navigates directly to `/blog` (not yet implemented)? The custom 404 page MUST be displayed.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST pre-render all routes at build time (SSG) so that pages are fully readable without JavaScript execution.
- **FR-002**: The home page MUST display the owner's name, professional headline, a short summary (≤ 300 characters), one CTA button, and at least one social link (LinkedIn) above the fold on a 375 px mobile screen.
- **FR-003**: The dark/light mode toggle MUST persist the user's choice in `localStorage` under the key `theme-preference` and apply the system `prefers-color-scheme` as the initial default if no saved preference exists.
- **FR-004**: The resume page MUST display a professional summary (≤ 400 characters), skills grouped into at least three categories, and work experience entries ordered by start year descending.
- **FR-005**: The contact form MUST validate name (required, min 2 chars), email (required, valid format), and message (required, min 10 chars) with inline error messages on blur.
- **FR-006**: The contact form MUST include a hidden honeypot field; any submission with that field populated MUST be silently discarded.
- **FR-007**: The contact form MUST submit to a Formspree endpoint and display a success message within 2 seconds of a successful response; on error it MUST display an error banner without clearing field values.
- **FR-008**: The projects page MUST display project cards containing title, generic description, and technology tags — no links to source code repositories.
- **FR-009**: The projects page MUST support client-side filtering by technology tag without a page reload.
- **FR-010**: All portfolio content (projects, skills, experience) MUST be sourced from Markdown files with YAML front-matter; no content is hardcoded in Angular component class files.
- **FR-011**: The sticky header MUST appear on every page and include: site logo/name (link to home), navigation links (Home, Currículo, Projetos, Contato), the theme toggle, and a hamburger menu on viewports < 640 px.
- **FR-012**: The mobile hamburger menu MUST close when a navigation link is selected or the Escape key is pressed, returning focus to the hamburger button.
- **FR-013**: Every page MUST have a unique `<title>`, `<meta name="description">`, canonical link, and Open Graph tags present in the pre-rendered HTML.
- **FR-014**: The build pipeline MUST generate `sitemap.xml` and `robots.txt` and include them in the deployment output.
- **FR-015**: The home page MUST include JSON-LD structured data for the `Person` schema type.
- **FR-016**: GA4 MUST be initialised on every page load and track `page_view` events; the contact form MUST emit a `form_submit` event on successful submission.
- **FR-017**: All pages MUST pass WCAG 2.1 AA: contrast ratio ≥ 4.5:1 for normal text, all interactive elements keyboard-accessible with visible focus indicators, form inputs labelled with `<label>` elements, and ARIA live regions for dynamic feedback.
- **FR-018**: The layout MUST be mobile-first and fully functional from 320 px to 2560 px viewport width with no horizontal overflow at any breakpoint.
- **FR-019**: All touch/click targets MUST be at least 40 × 40 px.
- **FR-020**: A custom 404 page MUST be served for any unrecognised route.
- **FR-021**: Cloudflare Pages `_headers` file MUST include `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin` headers.

### Key Entities

- **PersonProfile**: Represents the site owner — headline, short summary, social links. Single instance, sourced from a Markdown/JSON file.
- **SkillCategory**: A named group of skills (e.g., "Frontend") containing an ordered list of skill label strings.
- **ExperienceEntry**: One employment record — company name, role title, start year, optional end year (null = current), and a description paragraph.
- **Project**: A portfolio item — generic title, description paragraph, array of technology tag strings, and a boolean `featured` flag.
- **ContactSubmission**: Ephemeral data collected by the form — name, email, message, and honeypot field — transmitted to Formspree; never persisted client-side.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify who the site owner is and navigate to the resume or contact page within 10 seconds of the page finishing loading.
- **SC-002**: Lighthouse CI scores ≥ 95 on Performance, Accessibility, Best Practices, and SEO for all four primary routes (`/`, `/resume`, `/projects`, `/contact`).
- **SC-003**: Largest Contentful Paint ≤ 1.5s on simulated 4G (WebPageTest or Lighthouse) for the home page.
- **SC-004**: Cumulative Layout Shift < 0.1 on all pages.
- **SC-005**: Gzipped JavaScript bundle (excluding image assets) remains below 200 KB.
- **SC-006**: Contact form submissions result in an email delivered to the site owner within 2 seconds of the visitor clicking Submit.
- **SC-007**: The site is fully readable (all content visible, all links functional) with JavaScript disabled in the browser.
- **SC-008**: All interactive elements are reachable and operable using only the keyboard (Tab, Enter, Space, Escape).
- **SC-009**: Colour contrast ratio ≥ 4.5:1 in both light and dark themes, verified with an automated accessibility checker.
- **SC-010**: The site is indexed by Google Search Console within 7 days of the public launch, with no crawl errors reported.
- **SC-011**: The `sitemap.xml` lists all public routes and is reachable without authentication at `/sitemap.xml`.
- **SC-012**: The JSON-LD `Person` schema on the home page passes validation on schema.org's Structured Data Testing Tool with zero errors.

---

## Assumptions

- The site owner's personal details (name, headline, summary, skills, experience, projects) will be provided as content before the implementation phase; placeholder content will be used during development.
- Formspree free tier is acceptable for initial launch (up to 50 submissions/month); rate limiting at the infrastructure level is handled by Formspree and Cloudflare, not by client-side logic alone.
- The blog page is explicitly deferred — no implementation is required in this specification. A placeholder 404 or "coming soon" page is acceptable for `/blog`.
- Resume PDF download is explicitly deferred to a future release.
- Cloudflare Analytics Engine is available as a passive data source (no Angular integration required); primary analytics instrumentation uses GA4.
- The primary social link for this release is LinkedIn only; other social platforms (GitHub, Twitter/X) may be added without a spec revision.
- TypeScript strict mode and ESLint/Prettier are configured as part of the project scaffolding before any feature implementation begins.
- The site will be served exclusively over HTTPS via Cloudflare; no HTTP redirect logic needs to be implemented in Angular.
- The `og:image` Open Graph image will be a single static file placed in `assets/images/`; dynamic per-page images are out of scope.
- Primary colour palette and typography tokens will be finalised during the planning phase (`/speckit.plan`); this spec treats them as design decisions, not functional requirements.
