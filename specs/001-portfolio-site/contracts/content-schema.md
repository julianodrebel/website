# Contract: Content JSON Schemas

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11

Defines the shape of every JSON file in `src/assets/data/`. These files are loaded at runtime by `ContentService` via `HttpClient`. Validated by TypeScript interfaces at compile time; no runtime schema validation library is needed.

---

## `src/assets/data/profile.json`

Shape: single `PersonProfile` object.

```json
{
  "name": "string (required, non-empty)",
  "headline": "string (required, ≤80 chars)",
  "summary": "string (required, ≤300 chars)",
  "email": "string (optional, valid email)",
  "location": "string (optional)",
  "socialLinks": [
    {
      "platform": "string (required) — 'linkedin' | 'github' | 'twitter' | custom",
      "url": "string (required, https://...)",
      "label": "string (required — screen reader text)"
    }
  ],
  "ogImage": "string (required) — relative path e.g. 'assets/images/og-image.png'",
  "seo": {
    "defaultDescription": "string (required, ≤160 chars)"
  }
}
```

---

## `src/assets/data/skills.json`

Shape: `SkillCategory[]` (array at top level).

```json
[
  {
    "category": "string (required, non-empty)",
    "items": ["string", "..."]
  }
]
```

Minimum: 1 category. Minimum items per category: 1.

---

## `src/assets/data/experience.json`

Shape: `ExperienceEntry[]` (array at top level). Sorted by `startYear` **descending** (most recent first) at the data level — `ContentService` re-sorts on load as a safety measure.

```json
[
  {
    "id": "string (required, unique, e.g. 'exp-001')",
    "startYear": "number (required, 4-digit year)",
    "endYear": "number | null (required — null means current position)",
    "company": "string (required, non-empty)",
    "role": "string (required, non-empty)",
    "description": "string (required, ≤400 chars, plain text only)"
  }
]
```

---

## `src/assets/data/projects.json`

Shape: `Project[]` (array at top level).

```json
[
  {
    "id": "string (required, unique, e.g. 'proj-001')",
    "title": "string (required, ≤60 chars)",
    "description": "string (required, ≤200 chars)",
    "technologies": ["string", "..."],
    "featured": "boolean (required)"
  }
]
```

Minimum: 1 technology per project.

---

## ContentService Load Contract

```typescript
// src/app/core/services/content.service.ts
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly profile$    = this.http.get<PersonProfile>('assets/data/profile.json');
  readonly skills$     = this.http.get<SkillCategory[]>('assets/data/skills.json');
  readonly experience$ = this.http.get<ExperienceEntry[]>('assets/data/experience.json').pipe(
    map(entries => [...entries].sort((a, b) => b.startYear - a.startYear))
  );
  readonly projects$   = this.http.get<Project[]>('assets/data/projects.json');

  constructor(private readonly http: HttpClient) {}
}
```

**Error handling**: If any JSON file fails to load (HTTP error), the corresponding page section must display a graceful fallback message: `"Content temporarily unavailable."` — using `catchError` in the component.

---

## Environment Variables

`src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  formspreeId: 'REPLACE_WITH_FORMSPREE_ID',  // public value, not a secret
  ga4MeasurementId: 'REPLACE_WITH_GA4_ID',   // public value, not a secret
  siteUrl: 'http://localhost:4200',
};
```

`src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  formspreeId: 'REPLACE_WITH_FORMSPREE_ID',
  ga4MeasurementId: 'REPLACE_WITH_GA4_ID',
  siteUrl: 'https://drebel.tech',
};
```

These are file-replacement substituted by Angular CLI during `ng build --configuration=production`.
