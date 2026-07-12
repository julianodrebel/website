# Prompt de Constitution - Site Pessoal (drebel-website)

Execute este prompt na etapa de constitution do speckit para estabelecer os princípios e diretrizes do projeto.

---

## Instrução para o speckit.constitution

Você está criando a constitution para um **Site Pessoal - Portfólio + Currículo Online** que será hospedado no Cloudflare Pages.

### 📋 Contexto do Projeto

**Objetivo Geral:**
Desenvolver um site pessoal minimalista e performático que funcione como:
1. Portfólio profissional showcasing projetos
2. Currículo online interativo
3. Hub de contato para oportunidades de carreira (CLT) e projetos freelance

**Público-Alvo:** Recrutadores, empresas e potenciais clientes

**Restrições Tecnológicas:**
- Stack: Angular
- Deploy: Cloudflare Pages (build estático/SSG)
- Conteúdo: Hardcoded em markdown (sem CMS externo)
- Hosting: Sem servidor backend personalizado

---

## 🎯 Princípios de Desenvolvimento

Defina estes como princípios orientadores da constitution:

1. **Performance First (Core Web Vitals)**
   - Lighthouse score ≥ 95 em todas as categorias
   - LCP < 2.5s, FID < 100ms, CLS < 0.1
   - Otimização agressiva: lazy loading, code splitting, image optimization
   - Considerar Angular SSG com @angular/build ou pre-rendering

2. **Minimalismo e Clareza**
   - Design clean e direto ao ponto
   - Sem clutter visual ou animações desnecessárias
   - Tipografia e espaçamento bem definidos
   - Cada elemento tem propósito funcional claro

3. **SEO e Descoberta**
   - Meta tags otimizadas para cada página
   - Sitemap.xml gerado automaticamente
   - Schema markup (JSON-LD) para conteúdo profissional
   - Open Graph para compartilhamento social

4. **Experiência do Usuário Profissional**
   - Dark mode + Light mode com preferência do sistema
   - Navegação intuitiva (máx 3 cliques para qualquer conteúdo)
   - Formulário de contato com validação e feedback
   - Responsividade perfeita (mobile-first)

5. **Manutenibilidade e Escalabilidade**
   - Conteúdo separado em arquivos markdown organizados
   - Estrutura modular de componentes Angular
   - Documentação inline em código-chave
   - Build determinístico e reproduzível

---

## 📦 Arquitetura e Decisões Técnicas

### Stack Tecnológico
- **Framework Principal:** Angular (latest stable)
- **Styling:** CSS3 + BEM methodology (ou Tailwind CSS para rapidez)
- **Build Tool:** @angular/cli com ssr/prerendering configurado para SSG
- **Conteúdo:** Markdown com parser (front-matter para metadados)
- **Analytics:** Google Analytics ou Cloudflare Analytics Engine
- **Deploy:** Cloudflare Pages (zero-config com wrangler.toml)

### Estrutura de Pastas Esperada
```
src/
├── app/
│   ├── layout/         # Header, Footer, Navigation
│   ├── pages/          # Home, Projects, Blog, Contact, Resume
│   ├── components/     # Reusable UI components
│   ├── services/       # Data fetching, markdown parsing
│   └── styles/         # Global styles, variables, themes
├── assets/
│   ├── projects/       # Project markdown + images
│   ├── blog/          # Blog posts (markdown)
│   └── images/        # Logos, favicons, hero images
├── environments/       # Env configs (analytics ID, etc)
└── index.html         # Entry point
wrangler.toml          # Cloudflare Pages config
angular.json           # Angular config com outputHashing, minification
tsconfig.json          # TypeScript strict mode enabled
```

### Páginas Obrigatórias
1. **Home** - Apresentação pessoal + CTA para contato/projetos
2. **Projetos** - Galeria com filtros (e.g., por technology, year)
3. **Currículo** - Timeline de experiência + skills
4. **Blog** (Opcional inicialmente) - Artigos técnicos
5. **Contato** - Formulário com validação
6. **404** - Página de erro customizada

### Features Obrigatórias
- ✅ Dark/Light mode toggle (persistir em localStorage)
- ✅ Filtros de projetos (por tecnologia, categoria)
- ✅ Formulário de contato (validação + feedback)
- ✅ Analytics integrado
- ✅ Links sociais (LinkedIn, GitHub, Twitter, etc)
- ✅ Meta tags dinâmicas + Open Graph
- ✅ Favicon + branding visual

---

## ✅ Critérios de Qualidade

### Code Quality
- TypeScript strict mode ativo
- Linting com ESLint (Angular preset)
- Formatação com Prettier
- Cobertura de testes ≥ 60% para componentes críticos
- Sem console warnings/errors em produção

### Performance
- Bundle size: < 200KB (gzipped) sem assets
- Imagens otimizadas (WebP com fallback)
- Fonts servidas via system stack ou Google Fonts optimized
- CSS crítico inline, defer CSS não-crítico

### Accessibility (A11y)
- WCAG 2.1 AA compliance (mínimo)
- Keyboard navigation funcional
- ARIA labels onde necessário
- Contrast ratio ≥ 4.5:1

### SEO
- Canonical tags
- Robots.txt
- Sitemap.xml
- Structured data (schema.org)

---

## 🚀 Convenções e Padrões

### Naming Conventions
- **Components:** PascalCase (e.g., `ProjectCard.component.ts`)
- **Services:** PascalCase com sufixo `.service.ts`
- **Pipes/Guards:** kebab-case
- **CSS Classes:** kebab-case (BEM: `block__element--modifier`)

### Markdown Front-Matter (para projetos/posts)
```yaml
---
title: "Título do Projeto"
description: "Descrição breve"
tags: ["Angular", "TypeScript", "Cloudflare"]
date: "2026-01-15"
featured: true
link: "https://github.com/..."
---
```

### Commit Messages
- Formato: `[type](scope): description`
- Types: feat, fix, docs, style, refactor, perf, test, chore
- Exemplo: `[feat](projects): add project filtering by technology`

### Branches
- `main` - produção (Cloudflare Pages)
- `develop` - staging/development
- `feature/*` - novas features
- `hotfix/*` - correções urgentes

---

## 🔧 Constraints e Limitações

1. **Sem Backend Personalizado**
   - Formulário de contato: usar Formspree, Netlify Forms, ou email via CloudFlare Workers
   - Sem banco de dados (dados em markdown/JSON estático)

2. **Cloudflare Pages Specifics**
   - Build command: `npm run build` (Angular SSG)
   - Output directory: `dist/`
   - Timezone-aware deployments
   - Suportar custom domain

3. **Angular SSG no Cloudflare Pages**
   - Usar pre-rendering para páginas estáticas
   - Routes devem ser pré-geradas (sem SSR dinâmico)
   - Service Worker opcional para offline-first

4. **Dados de Conteúdo**
   - Projetos, experiência, skills em markdown ou JSON
   - Atualizações via git commit (no-build para metadata)
   - Versionamento de portfolio: git tags para releases

---

## 📊 Métricas de Sucesso

- [ ] Lighthouse score ≥ 95 (todas categorias)
- [ ] Time to First Contentful Paint < 1.5s
- [ ] Bundle size < 200KB (gzipped)
- [ ] 100% uptime (hosted na Cloudflare)
- [ ] Formulário de contato respondendo em < 2s
- [ ] Mobile: 100% viewport coverage
- [ ] SEO: Indexação em 7 dias pós-launch

---

## 🔐 Segurança e Compliance

- Content Security Policy (CSP) header configurado
- X-Frame-Options e X-Content-Type-Options
- HTTPS enforced (Cloudflare automático)
- Privacy policy + terms (se aplicável)
- GDPR compliance para analytics/forms

---

## 📝 Próximos Passos Após Constitution

1. Executar `speckit.specify` para criar feature spec detalhada
2. Executar `speckit.plan` para design artifacts
3. Executar `speckit.tasks` para task breakdown
4. Executar `speckit.implement` para implementação

---

**Criado em:** 2026-07-11
**Versão:** 1.0
**Status:** Ready for speckit constitution phase
