# Contract: Routing & Page Meta

**Feature**: `001-portfolio-site` | **Date**: 2026-07-11

Defines the URL routes that the Angular router handles and the per-page SEO metadata baked into the pre-rendered HTML.

---

## Routes

| Route | Angular Component | Pre-rendered | Notes |
|-------|-------------------|--------------|-------|
| `/` | `HomeComponent` | ✅ | Entry point |
| `/resume` | `ResumeComponent` | ✅ | Online CV |
| `/projects` | `ProjectsComponent` | ✅ | Portfolio gallery |
| `/contact` | `ContactComponent` | ✅ | Contact form |
| `/404` | `NotFoundComponent` | ✅ | Explicit pre-render |
| `/**` | redirect → `/404` | N/A | Catch-all |

**`routes.txt`** (used by `@angular/build` prerender):
```
/
/resume
/projects
/contact
/404
```

**`app.routes.ts`** structure:
```typescript
export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,   // header + router-outlet + footer
    children: [
      { path: '',         loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
      { path: 'resume',   loadComponent: () => import('./features/resume/resume.component').then(m => m.ResumeComponent) },
      { path: 'projects', loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'contact',  loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent) },
      { path: '404',      loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent) },
      { path: '**',       redirectTo: '/404' },
    ],
  },
];
```

---

## Per-Page Meta Tags

All values are set via Angular's `Meta` and `Title` services inside each route component's `ngOnInit`. They are present in the SSG pre-rendered HTML.

### `/` — Home

| Tag | Value |
|-----|-------|
| `<title>` | `{headline} \| {name}` e.g. `Sênior Software Developer \| Juliano Drebel` |
| `meta[name="description"]` | `PersonProfile.seo.defaultDescription` (≤ 160 chars) |
| `link[rel="canonical"]` | `https://drebel.tech/` |
| `meta[property="og:title"]` | Same as `<title>` |
| `meta[property="og:description"]` | Same as description |
| `meta[property="og:image"]` | `https://drebel.tech/assets/images/og-image.png` |
| `meta[property="og:url"]` | `https://drebel.tech/` |
| `meta[property="og:type"]` | `website` |
| JSON-LD | `Person` schema (see below) |

### `/resume`

| Tag | Value |
|-----|-------|
| `<title>` | `Resume — {headline} \| {name}` |
| `meta[name="description"]` | `"Online resume of {name} — {headline}. View experience, skills, and qualifications."` |
| `link[rel="canonical"]` | `https://drebel.tech/resume` |
| OG tags | Same pattern as home, page-specific values |

### `/projects`

| Tag | Value |
|-----|-------|
| `<title>` | `Projects — {name}` |
| `meta[name="description"]` | `"Portfolio projects by {name} — {headline}."` |
| `link[rel="canonical"]` | `https://drebel.tech/projects` |
| OG tags | Same pattern |

### `/contact`

| Tag | Value |
|-----|-------|
| `<title>` | `Contact — {name}` |
| `meta[name="description"]` | `"Get in touch with {name} for CLT opportunities or freelance projects."` |
| `link[rel="canonical"]` | `https://drebel.tech/contact` |
| OG tags | Same pattern |

### `/404`

| Tag | Value |
|-----|-------|
| `<title>` | `Page Not Found — {name}` |
| `meta[name="robots"]` | `noindex` |

---

## JSON-LD: `Person` Schema (Home Page)

Injected as a `<script type="application/ld+json">` tag in `HomeComponent.ngOnInit`:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "{PersonProfile.name}",
  "jobTitle": "{PersonProfile.headline}",
  "url": "https://drebel.tech",
  "sameAs": ["{socialLinks[].url}", "..."],
  "worksFor": { "@type": "Organization", "name": "{most recent ExperienceEntry.company}" }
}
```

---

## Navigation Active-State Contract

The header's navigation links must apply an `aria-current="page"` attribute and a CSS class `nav-link--active` to the link matching the current route. Determined by comparing `Router.url` with each route path.

| Route | Active Link |
|-------|-------------|
| `/` | Home |
| `/resume` | Currículo |
| `/projects` | Projetos |
| `/contact` | Contato |
