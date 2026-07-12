# Prompt de Plan - Site Pessoal drebel-website

Execute este prompt na etapa de `speckit plan` para gerar os design artifacts e plano de implementação detalhado.

---

## Instrução para o speckit.plan

Você está criando o **Plano de Implementação** para o site pessoal drebel-website com todas as decisões arquiteturais, design system, organização de código e estratégia técnica.

### 📌 Contexto do Projeto (Resumo)

- **Nome:** drebel-website
- **Tipo:** Site Pessoal - Portfólio + Currículo Online
- **Stack:** Angular + TypeScript + Cloudflare Pages
- **Público:** Recrutadores e empresas
- **Performance Target:** Lighthouse ≥ 95

---

## 🎨 Design System

### 1. Paleta de Cores (A Definir)

**Tema Light (Padrão):**
```scss
$color-bg-primary: #FFFFFF;        // Fundo principal
$color-bg-secondary: #F5F5F5;      // Fundo secundário
$color-text-primary: #1A1A1A;      // Texto principal
$color-text-secondary: #666666;    // Texto secundário
$color-accent: #0066CC;            // Cor de destaque (azul)
$color-border: #E0E0E0;            // Bordas
```

**Tema Dark:**
```scss
$color-bg-primary: #0A0E27;        // Fundo escuro
$color-bg-secondary: #14192A;      // Fundo secundário
$color-text-primary: #FFFFFF;      // Texto branco
$color-text-secondary: #B0B0B0;    // Texto secundário
$color-accent: #4D94FF;            // Azul mais claro
$color-border: #2A3A5A;            // Bordas
```

### 2. Tipografia

**Font Stack:**
```scss
// Primary (System fonts - para performance)
$font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;

// Monospace (para código)
$font-family-mono: 'Courier New', Courier, monospace;
```

**Escalas de Tamanho:**
```scss
$font-size-h1: 2.5rem;    // 40px (hero, títulos principais)
$font-size-h2: 2rem;      // 32px
$font-size-h3: 1.5rem;    // 24px
$font-size-body: 1rem;    // 16px (padrão)
$font-size-small: 0.875rem; // 14px (labels, helpers)
$font-size-tiny: 0.75rem;   // 12px (captions)

$line-height-tight: 1.2;
$line-height-normal: 1.6;
$line-height-relaxed: 1.8;
```

**Font Weights:**
```scss
$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### 3. Espaçamento (Sistema 8px)

```scss
$spacing-xs: 0.25rem;  // 4px
$spacing-sm: 0.5rem;   // 8px
$spacing-md: 1rem;     // 16px
$spacing-lg: 1.5rem;   // 24px
$spacing-xl: 2rem;     // 32px
$spacing-2xl: 3rem;    // 48px
$spacing-3xl: 4rem;    // 64px
```

### 4. Sombras (Depth)

```scss
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

### 5. Breakpoints (Mobile-First)

```scss
$breakpoint-sm: 640px;   // Tablet pequeno
$breakpoint-md: 768px;   // Tablet
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Desktop grande
$breakpoint-2xl: 1536px; // Desktop muito grande
```

### 6. Transições & Animações

```scss
$transition-fast: 150ms ease;
$transition-normal: 250ms ease;
$transition-slow: 350ms ease;

// Easing
$ease-in: cubic-bezier(0.4, 0, 1, 1);
$ease-out: cubic-bezier(0, 0, 0.2, 1);
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## 🏗️ Arquitetura de Componentes

### Estratégia: Standalone Components + Feature Modules

**Princípios:**
- Angular 14+ standalone components (no NgModule)
- Componentes reutilizáveis em `shared/`
- Features agrupadas em `features/`
- Serviços em `core/`

### Tipos de Componentes

1. **Presentational (Dumb)**
   - Apenas recebem @Input e emitem @Output
   - Sem lógica de negócio
   - Reutilizáveis
   - Exemplo: `ButtonComponent`, `CardComponent`

2. **Container (Smart)**
   - Gerenciam estado
   - Fazem chamadas a serviços
   - Orquestram outros componentes
   - Exemplo: `ProjectListComponent`, `ContactFormContainer`

3. **Layout**
   - Header, Footer, Sidebar
   - Usam ng-content para composição
   - Aplicados via Router

---

## 📁 Estrutura de Pastas

```
drebel-website/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   │   ├── content.service.ts
│   │   │   │   ├── theme.service.ts
│   │   │   │   └── analytics.service.ts
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── button/
│   │   │   │   ├── card/
│   │   │   │   ├── tag/
│   │   │   │   ├── form-field/
│   │   │   │   └── icon/ (SVG inline)
│   │   │   ├── pipes/
│   │   │   ├── directives/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   │
│   │   ├── features/
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   ├── hero.component.ts
│   │   │   │   └── about.component.ts
│   │   │   ├── resume/
│   │   │   │   ├── resume.component.ts
│   │   │   │   ├── timeline.component.ts
│   │   │   │   └── skills-list.component.ts
│   │   │   ├── projects/
│   │   │   │   ├── projects.component.ts
│   │   │   │   ├── project-card.component.ts
│   │   │   │   └── project-filter.component.ts
│   │   │   └── contact/
│   │   │       ├── contact.component.ts
│   │   │       └── contact-form.component.ts
│   │   │
│   │   ├── layout/
│   │   │   ├── header.component.ts
│   │   │   ├── footer.component.ts
│   │   │   └── navigation.component.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── _variables.scss
│   │   │   ├── _tokens.scss
│   │   │   ├── _reset.scss
│   │   │   ├── _typography.scss
│   │   │   ├── _animations.scss
│   │   │   └── global.scss
│   │   │
│   │   └── app.component.ts
│   │
│   ├── assets/
│   │   ├── data/
│   │   │   ├── resume.json
│   │   │   ├── projects.json
│   │   │   ├── skills.json
│   │   │   └── experience.json
│   │   ├── images/
│   │   │   ├── hero/
│   │   │   ├── icons/
│   │   │   └── og-image.png
│   │   └── fonts/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   └── index.html
│
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── .well-known/ (Cloudflare verification)
│
├── .github/
│   └── workflows/
│       └── deploy.yml (CI/CD)
│
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── DESIGN_SYSTEM.md
│
├── angular.json
├── tsconfig.json
├── tailwind.config.js (se Tailwind)
├── wrangler.toml (Cloudflare Pages)
└── README.md
```

---

## 💾 Gerenciamento de Conteúdo

### Estratégia: JSON + Services

**Arquivos JSON em `src/assets/data/`:**

#### resume.json
```json
{
  "summary": "Professional summary text...",
  "experience": [
    {
      "id": "exp-1",
      "startYear": 2024,
      "endYear": null,
      "company": "Company Name",
      "role": "Senior Developer",
      "description": "Brief description of role"
    }
  ],
  "skills": [
    {
      "category": "Frontend",
      "items": ["Angular", "TypeScript", "CSS3"]
    }
  ]
}
```

#### projects.json
```json
{
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Title",
      "description": "Generic description",
      "technologies": ["Angular", "TypeScript"],
      "featured": true
    }
  ]
}
```

### ContentService

```typescript
// core/services/content.service.ts
export class ContentService {
  resume$ = this.http.get<Resume>('assets/data/resume.json');
  projects$ = this.http.get<Project[]>('assets/data/projects.json');
  
  constructor(private http: HttpClient) {}
}
```

---

## 🎭 Gerenciamento de Estado

### Estratégia: LocalStorage + Observables

**Tema (Dark/Light Mode):**
```typescript
// core/services/theme.service.ts
export class ThemeService {
  private darkMode$ = new BehaviorSubject<boolean>(this.getThemePreference());
  
  getThemePreference(): boolean {
    const saved = localStorage.getItem('theme-preference');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  toggleTheme(): void {
    const isDark = !this.darkMode$.value;
    this.darkMode$.next(isDark);
    localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
  }
}
```

**Filtros de Projetos:**
```typescript
// Usar BehaviorSubject para estado de filtro
projectFilter$ = new BehaviorSubject<string[]>([]);
```

---

## 🛣️ Roteamento (SSG Pre-rendering)

### Estratégia: Pre-render todas as rotas

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'resume', component: ResumeComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'contact', component: ContactComponent },
      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '/404' }
    ]
  }
];
```

### Build Config (angular.json)

```json
{
  "projects": {
    "drebel-website": {
      "architect": {
        "build": {
          "options": {
            "prerender": true,
            "routes": [
              "/",
              "/resume",
              "/projects",
              "/contact"
            ]
          }
        }
      }
    }
  }
}
```

---

## ⚠️ Error Handling

### Estratégia: Try-Catch + Error Boundary Components

```typescript
// Error Boundary Component
@Component({
  selector: 'app-error-boundary',
  template: `
    <div *ngIf="error" class="error-container">
      <p>{{ error }}</p>
    </div>
    <ng-container *ngIf="!error">
      <ng-content></ng-content>
    </ng-container>
  `
})
export class ErrorBoundaryComponent {
  error: string | null = null;
  
  @Input() set data(value: any) {
    try {
      // Process data
    } catch (e) {
      this.error = 'Erro ao carregar conteúdo';
    }
  }
}
```

---

## 🚀 Otimizações de Build

### Implementadas:

1. **Code Splitting por Rota**
   - Lazy loading automático
   - Reduz bundle inicial

2. **Tree-Shaking**
   - Remover código não-utilizado
   - Angular CLI automático

3. **Image Optimization**
   - WebP com fallback
   - Responsive images (srcset)
   - Lazy loading (IntersectionObserver)

4. **Minificação + Gzip**
   - Angular CLI automático
   - Cloudflare compressão

---

## 🔄 Roteamento & Navegação

### Estrutura:

```typescript
// Rotas pré-renderizadas no build
const prerenderedRoutes = [
  '/',              // Home
  '/resume',        // Currículo
  '/projects',      // Projetos
  '/contact'        // Contato
];

// 404 também pré-renderizado
```

### Estratégia de Navegação:

- **Router links** em templates (navigation)
- **Preload strategy** para rotas próximas (opcional)
- **Scroll to top** ao navegar

---

## 🧪 Testes

### Estratégia: Manual (sem testes automatizados no MVP)

**Checklist de Testes Manuais:**

- [ ] Home page carrega sem erro
- [ ] Dark/Light mode alterna sem flicker
- [ ] Formulário de contato submete com sucesso
- [ ] Links de navegação funcionam
- [ ] Mobile responsividade (320px, 768px, 1024px)
- [ ] Lighthouse score ≥ 95
- [ ] Acessibilidade: keyboard navigation
- [ ] SEO: meta tags presentes

### Ferramentas de Validação:

- Lighthouse (Performance, Accessibility, SEO)
- axe DevTools (Acessibilidade)
- Manual browser testing

---

## ♿ Acessibilidade (WCAG 2.1 AA)

### Estratégia: Validação Manual + Ferramentas

**Checklist:**

- [ ] HTML semântico (nav, main, footer)
- [ ] ARIA labels em inputs
- [ ] Contraste ≥ 4.5:1
- [ ] Keyboard navigation funcional (Tab, Enter, Escape)
- [ ] Imagens com alt text
- [ ] Aria-live para atualizações dinâmicas
- [ ] Focus indicators visíveis
- [ ] Tamanho de tap target ≥ 40x40px

### Ferramentas:

- axe DevTools (browser)
- Lighthouse (a11y score)
- WAVE (browser extension)

---

## 🌍 Internacionalização (i18n)

### Estratégia: Suportar Múltiplos Idiomas (Português + Inglês)

```typescript
// Usando @angular/localize
// i18n.json
{
  "locales": ["pt-BR", "en-US"],
  "sourceLocale": "pt-BR"
}
```

**Estrutura de Traduções:**

```
src/
├── locale/
│   ├── messages.pt-BR.json
│   └── messages.en-US.json
```

**Exemplo de Tradução:**

```json
{
  "hero_title": "Sênior Software Developer",
  "hero_subtitle": "Portfólio & Currículo Online"
}
```

---

## 🔧 CI/CD com GitHub Actions

### Workflow: deploy.yml

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### Estratégia:

- **Main branch:** Deploy automático em produção
- **Pull requests:** Deploy de preview
- **Lint + Build:** Validação antes de merge

---

## 📚 Documentação

### Arquivos de Documentação:

1. **README.md**
   - Setup local
   - Commands (dev, build, deploy)
   - Estructura de projeto

2. **ARCHITECTURE.md** (em docs/)
   - Decisões arquiteturais
   - Fluxos de dados
   - Componentes principais

3. **DESIGN_SYSTEM.md** (em docs/)
   - Paleta de cores
   - Componentes disponíveis
   - Padrões de uso

---

## 📊 Estrutura de Dados Global

```typescript
// types/index.ts

export interface Resume {
  summary: string;
  experience: Experience[];
  skills: Skill[];
}

export interface Experience {
  id: string;
  startYear: number;
  endYear: number | null;
  company: string;
  role: string;
  description: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  featured: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}
```

---

## 🎯 Princípios de Design & Arquitetura

1. **Mobile-First:** Design começa mobile, escala para desktop
2. **Composição:** Componentes pequenos + composição
3. **Reutilização:** Shared components para máxima reutilização
4. **Performance:** Otimização agressiva desde o início
5. **Acessibilidade:** WCAG 2.1 AA em tudo
6. **Manutenibilidade:** Código limpo, bem documentado

---

## 📋 Checklist de Planejamento

- [ ] Paleta de cores definida
- [ ] Design system tokens criados
- [ ] Componentes principais identificados
- [ ] Estrutura de pastas estabelecida
- [ ] Formato de dados (JSON schema) definido
- [ ] Roteamento pré-renderizado planejado
- [ ] CI/CD workflow pronto
- [ ] Documentação inicial criada
- [ ] Testes manuais identificados
- [ ] Métricas de sucesso confirmadas

---

## 🚀 Próximos Passos Após Plan

1. Executar `speckit.tasks` para gerar task breakdown detalhado
2. Executar `speckit.implement` para começar implementação
3. Executar testes manuais conforme tasks completadas

---

**Criado em:** 2026-07-11
**Versão:** 1.0
**Status:** Ready for speckit.plan phase
