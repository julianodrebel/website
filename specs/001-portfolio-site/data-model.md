# Data Model: Personal Portfolio Website

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11

All entities are stored as JSON assets in `src/assets/data/` and loaded at runtime by `ContentService`. No database or ORM is involved.

---

## Entity: PersonProfile

**File**: `src/assets/data/profile.json`

Represents the site owner. Single instance — one JSON file, one object.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | `string` | ✅ | non-empty | Full display name |
| `headline` | `string` | ✅ | ≤ 80 chars | Professional title shown in hero and `<title>` |
| `summary` | `string` | ✅ | ≤ 300 chars | Short bio for hero "About Me" section |
| `email` | `string` | ❌ | valid email | Not displayed publicly; used in JSON-LD only |
| `location` | `string` | ❌ | — | City, Country |
| `socialLinks` | `SocialLink[]` | ✅ | min 1 | At least LinkedIn must be present |
| `ogImage` | `string` | ✅ | relative path | Path to `assets/images/og-image.png` |
| `seo.defaultDescription` | `string` | ✅ | ≤ 160 chars | Fallback `<meta name="description">` |

**`SocialLink` sub-type**:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `platform` | `'linkedin' \| 'github' \| 'twitter' \| string` | ✅ | Used to select icon SVG |
| `url` | `string` | ✅ | Full HTTPS URL |
| `label` | `string` | ✅ | Screen reader label, e.g. `"LinkedIn profile"` |

**Example**:
```json
{
  "name": "Juliano Drebel",
  "headline": "Sênior Software Developer",
  "summary": "Developer with 8+ years building scalable web applications with Angular and Node.js. Open to CLT roles and freelance projects.",
  "email": "hi@drebel.tech",
  "location": "São Paulo, BR",
  "socialLinks": [
    { "platform": "linkedin", "url": "https://linkedin.com/in/drebel", "label": "LinkedIn profile" }
  ],
  "ogImage": "assets/images/og-image.png",
  "seo": {
    "defaultDescription": "Portfolio and online resume of Juliano Drebel — Sênior Software Developer specialising in Angular and TypeScript."
  }
}
```

---

## Entity: SkillCategory

**File**: `src/assets/data/skills.json` — top-level array of `SkillCategory`

Groups skills by domain for the resume page.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `category` | `string` | ✅ | non-empty | Display name, e.g. `"Frontend"` |
| `items` | `string[]` | ✅ | min 1 item | Skill labels, e.g. `["Angular", "TypeScript"]` |

**Ordering**: Categories are rendered in array order; items within a category are rendered in array order.

**Example**:
```json
[
  { "category": "Frontend", "items": ["Angular", "TypeScript", "RxJS", "CSS3"] },
  { "category": "Backend",  "items": ["Node.js", "NestJS", "PostgreSQL"] },
  { "category": "DevOps",   "items": ["Docker", "GitHub Actions", "Cloudflare"] }
]
```

---

## Entity: ExperienceEntry

**File**: `src/assets/data/experience.json` — top-level array of `ExperienceEntry`

One entry per employment role. Rendered as a vertical timeline on `/resume`, ordered by `startYear` descending (most recent first).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | `string` | ✅ | unique, non-empty | Stable identifier; used as DOM `id` for anchor links |
| `startYear` | `number` | ✅ | 1990–current year | Four-digit year |
| `endYear` | `number \| null` | ✅ | ≥ `startYear` or `null` | `null` = current position |
| `company` | `string` | ✅ | non-empty | Company display name |
| `role` | `string` | ✅ | non-empty | Job title |
| `description` | `string` | ✅ | ≤ 400 chars | Plain text; no Markdown or HTML |

**State transitions**: An entry transitions from "current" (`endYear: null`) to "past" (`endYear: <year>`) when updated in the JSON file via a git commit.

**Example**:
```json
[
  {
    "id": "exp-001",
    "startYear": 2022,
    "endYear": null,
    "company": "Acme Fintech",
    "role": "Senior Frontend Developer",
    "description": "Led migration of legacy AngularJS dashboard to Angular 17. Reduced bundle size by 40% and improved Lighthouse score from 62 to 97."
  },
  {
    "id": "exp-002",
    "startYear": 2018,
    "endYear": 2022,
    "company": "StartupXYZ",
    "role": "Full-Stack Developer",
    "description": "Built customer portal with Angular + NestJS serving 25k daily active users."
  }
]
```

---

## Entity: Project

**File**: `src/assets/data/projects.json` — top-level array of `Project`

Displayed as a filterable card grid on `/projects`. No source code links; generic descriptions only.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | `string` | ✅ | unique, non-empty | Stable identifier |
| `title` | `string` | ✅ | ≤ 60 chars | Generic title, e.g. `"E-commerce Platform"` |
| `description` | `string` | ✅ | ≤ 200 chars | What the project does — no internal details |
| `technologies` | `string[]` | ✅ | min 1 item | Technology tags used for filtering |
| `featured` | `boolean` | ✅ | — | `true` = shown on home page (if implemented) |

**Filtering rule**: A project card is shown when its `technologies` array contains the active filter tag. When no filter is active, all cards are shown.

**Example**:
```json
[
  {
    "id": "proj-001",
    "title": "E-commerce Platform",
    "description": "Multi-tenant online store with product catalogue, cart, and checkout flow. Supports 10k SKUs.",
    "technologies": ["Angular", "Node.js", "PostgreSQL"],
    "featured": true
  },
  {
    "id": "proj-002",
    "title": "Fleet Management System",
    "description": "Real-time dashboard for tracking and scheduling a fleet of 500 vehicles.",
    "technologies": ["Angular", "WebSockets", "Docker"],
    "featured": false
  }
]
```

---

## Ephemeral: ContactSubmission

**Not persisted**. Collected by the contact form component, validated client-side, and `POST`ed to Formspree. Discarded after a response is received.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `name` | `string` | ✅ | min 2 chars | Sender's name |
| `email` | `string` | ✅ | valid email format | Sender's email |
| `message` | `string` | ✅ | min 10 chars | Message body |
| `_gotcha` | `string` | — | must be empty string | Honeypot; Formspree discards if non-empty |

**Validation errors** surface as inline messages per field on blur. The Submit button is disabled while any field is invalid.

---

## Runtime State: ThemePreference

**Not a data file** — managed entirely by `ThemeService`.

| State | Storage | Values | Initial Value |
|-------|---------|--------|---------------|
| Current theme | `BehaviorSubject<'light' \| 'dark'>` (in-memory) | `'light'` \| `'dark'` | Read from `localStorage` then `prefers-color-scheme` |
| Persisted preference | `localStorage['theme-preference']` | `'light'` \| `'dark'` | Written on every toggle |

**FOUC prevention**: An inline `<script>` in `index.html` reads `localStorage` and sets `document.documentElement.setAttribute('data-theme', value)` before Angular boots, so the correct theme is applied before first paint.

---

## TypeScript Interfaces

Canonical location: `src/app/shared/types/content.types.ts`

```typescript
export interface SocialLink {
  platform: string;
  url: string;
  label: string;
}

export interface PersonProfile {
  name: string;
  headline: string;
  summary: string;
  email?: string;
  location?: string;
  socialLinks: SocialLink[];
  ogImage: string;
  seo: { defaultDescription: string };
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface ExperienceEntry {
  id: string;
  startYear: number;
  endYear: number | null;
  company: string;
  role: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  _gotcha: '';
}

export type Theme = 'light' | 'dark';
```
