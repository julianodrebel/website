# Prompt de Specify - Site Pessoal drebel-website

Execute este prompt na etapa de `speckit specify` para gerar a feature specification detalhada.

---

## Instrução para o speckit.specify

Você está criando a **Feature Specification** para um site pessoal profissional que será portfólio + currículo online + hub de contato.

### 📌 Contexto do Projeto

**Nome do Projeto:** drebel-website
**Tipo:** Site Pessoal - Portfólio + Currículo Online
**Stack:** Angular + TypeScript
**Deploy:** Cloudflare Pages (SSG)
**URL Esperada:** drebel.tech (ou similar)

**Objetivo Principal:**
Criar um site minimalista e performático que sirva como:
1. Apresentação profissional para recrutadores e empresas
2. Currículo online interativo
3. Hub de contato para oportunidades (CLT) e projetos freelance

**Público-Alvo:** Recrutadores, empresas, potenciais clientes

---

## 🎯 Features a Especificar

### Feature 1: Home/Landing Page

**Descrição:** Página inicial com apresentação profissional e chamada para ação

**User Story:**
- Como recrutador, quero ver rapidamente quem é a pessoa
- Como potencial cliente, quero saber se vale a pena explorar mais

**Componentes:**
- **Hero Section** com nome completo, headline profissional ("Sênior Software Developer") e breve descrição
- **Sobre Mim** - Resumo executivo/Professional summary (máx 3-4 linhas)
- **Call-to-Action Único** - Botão destacado para "Ver Currículo" ou "Entrar em Contato"
- **Link Social Destacado** - LinkedIn
- **Dark/Light Mode Toggle** - Persistente em localStorage

**Critérios de Aceitação:**
- [ ] Hero section visível sem scroll (above the fold)
- [ ] Headline é consistente com metatags SEO ("Sênior Software Developer")
- [ ] CTA botão tem contraste adequado (WCAG AA)
- [ ] Modo dark/light alterna suavemente (fade-in, transição < 200ms)
- [ ] Responsivo em mobile (sem overflow horizontal)
- [ ] LCP < 1.5s, FID < 100ms
- [ ] Links são keyboard-acessíveis (tab order lógica)

**Tipos de Dados:**
```json
{
  "headline": "Sênior Software Developer",
  "aboutMe": "String (máx 300 chars)",
  "ctaText": "Ver Currículo",
  "ctaLink": "/resume",
  "socialLinks": [{ "platform": "LinkedIn", "url": "https://..." }]
}
```

---

### Feature 2: Página de Currículo (Resume)

**Descrição:** Página com experiência profissional, skills e resumo executivo

**User Story:**
- Como recrutador, quero ver experiência profissional, skills e resumo
- Como desenvolvedor, quero poder fazer download do currículo em PDF (futuro)

**Componentes:**
1. **Professional Summary** - Parágrafo introdutório com overview
2. **Skills por Categoria**
   - Frontend (Angular, TypeScript, CSS, etc)
   - Backend (Node.js, etc)
   - DevOps (Docker, CI/CD, etc)
3. **Timeline de Experiência**
   - Ano(s), Empresa, Cargo, Descrição breve
   - Ordenado de mais recente para mais antigo
4. **Educação/Certificações** (Opcional - não selecionado, mas deixar espaço)

**Critérios de Aceitação:**
- [ ] Timeline visualmente clara (usar conexões visuais verticais)
- [ ] Skills agrupados por categoria
- [ ] Experiência ordenada cronologicamente (desc)
- [ ] Cores/badges para diferenciar skill types
- [ ] Responsivo em mobile (cards não colapsam)
- [ ] Sem download PDF inicialmente (pode ser adicionado depois)
- [ ] SEO: Meta tags incluem "resume", "experience", "skills"

**Tipos de Dados:**
```json
{
  "summary": "String (máx 400 chars)",
  "skills": [
    { "category": "Frontend", "items": ["Angular", "TypeScript", ...] },
    { "category": "Backend", "items": ["Node.js", ...] },
    { "category": "DevOps", "items": ["Docker", ...] }
  ],
  "experience": [
    {
      "startYear": 2024,
      "endYear": null,
      "company": "Acme Corp",
      "role": "Senior Developer",
      "description": "..."
    }
  ]
}
```

---

### Feature 3: Seção de Projetos (Genérica)

**Descrição:** Exibição genérica de projetos sem expor detalhes específicos

**User Story:**
- Como recrutador, quero ver que a pessoa tem projetos (sem detalhes sensíveis)
- Como desenvolvedor, quero uma seção que mostre experiência sem expor código

**Componentes:**
1. **Cards de Projeto Genéricos**
   - Título genérico (ex: "Projeto E-commerce", "Sistema de Gestão")
   - Breve descrição (funcionalidades principais, sem detalhes)
   - Tecnologias usadas (tags)
   - Sem links diretos a código/repositório
   - Opcional: ícone ou imagem placeholder

2. **Filtro por Tecnologia** (Opcional)
   - Buttons para filtrar por tag
   - Dinâmico com JavaScript

**Critérios de Aceitação:**
- [ ] Nenhum repositório público ou código sensível exposto
- [ ] Cards exibem apenas: título, descrição genérica, techs
- [ ] Layout responsivo (grid 1-2-3 colunas conforme viewport)
- [ ] Filtros funcionam sem reload de página
- [ ] Animação moderate: fade-in ao entrar em viewport

**Tipos de Dados:**
```json
{
  "projects": [
    {
      "title": "Projeto E-commerce",
      "description": "Plataforma de vendas online com carrinho e checkout",
      "technologies": ["Angular", "Node.js", "MongoDB"],
      "featured": true
    }
  ]
}
```

---

### Feature 4: Formulário de Contato

**Descrição:** Formulário para interessados entrarem em contato

**User Story:**
- Como recrutador/cliente, quero deixar mensagem direta
- Como desenvolvedor, quero receber notificações de contato

**Componentes:**
1. **Campos de Input:**
   - Nome (texto, obrigatório, min 2 chars)
   - Email (email, obrigatório, validação de formato)
   - Observação/Mensagem (textarea, obrigatório, min 10 chars)

2. **Submissão:**
   - Validação client-side em tempo real
   - Botão submit (desabilitado se formulário inválido)
   - Feedback visual (loading spinner, mensagem de sucesso/erro)
   - Integração com Formspree (auto-email)

3. **Segurança:**
   - CSRF protection (token)
   - Rate limiting (máx 5 submissões por IP por hora)
   - Honeypot field (invisible)

**Critérios de Aceitação:**
- [ ] Validação ao blur/change (feedback imediato)
- [ ] Mensagem de erro clara e posicionada perto do campo
- [ ] Submit só funciona se todos os campos válidos
- [ ] Feedback de sucesso exibido por 3-5s
- [ ] Email recebido em max 2s após submit
- [ ] Acessível: labels associadas aos inputs, ARIA live regions
- [ ] Mobile: inputs com font-size ≥ 16px (sem zoom forçado)

**Tipos de Dados:**
```json
{
  "form": {
    "name": { "type": "text", "required": true, "minLength": 2 },
    "email": { "type": "email", "required": true },
    "message": { "type": "textarea", "required": true, "minLength": 10 },
    "honeypot": { "type": "hidden" }
  },
  "submission": {
    "endpoint": "https://formspree.io/f/YOUR_FORM_ID",
    "rateLimit": "5 per hour per IP"
  }
}
```

---

### Feature 5: Dark Mode / Light Mode Toggle

**Descrição:** Sistema de tema com preferência persistente

**User Story:**
- Como usuário, quero escolher entre tema claro e escuro
- Como desenvolvedor, quero que a preferência do usuário seja salva

**Componentes:**
1. **Toggle Button**
   - Ícone sol/lua (ou similar)
   - Posicionado no header (top-right)
   - Acessível: aria-label, keyboard support

2. **Tema Escuro:**
   - Paleta neutral (cinza, branco, preto)
   - Bom contraste para leitura
   - Reduz fadiga ocular

3. **Tema Claro:**
   - Fundo branco/off-white
   - Texto escuro
   - Sem glare

4. **Persistência:**
   - Salvo em localStorage com chave "theme-preference"
   - Fallback: preferência do sistema (prefers-color-scheme)

**Critérios de Aceitação:**
- [ ] Toggle alterna entre light/dark em < 300ms
- [ ] Preferência persiste após refresh
- [ ] Contraste ≥ 4.5:1 em ambos os temas
- [ ] Sem flash de cor ao carregar (media query prefers-color-scheme)
- [ ] Acessível: toggle é focusável e respondível a Enter/Space
- [ ] Todas as cores do site são consistentes nos dois temas

---

### Feature 6: Navigation & Layout

**Descrição:** Estrutura de navegação e layout consistente

**User Story:**
- Como visitante, quero navegar facilmente entre páginas
- Como usuário mobile, quero menu responsivo e fácil de usar

**Componentes:**
1. **Header Sticky**
   - Logo/Nome (link para home)
   - Menu de navegação (Home, Currículo, Projetos, Contato)
   - Dark/Light toggle
   - Menu hamburger em mobile

2. **Footer**
   - Links sociais (LinkedIn)
   - Copyright
   - Links legais (se necessário)

3. **Menu Mobile**
   - Hamburger button (40px tap target)
   - Slide-in menu ou dropdown
   - Fecha ao selecionar link

**Critérios de Aceitação:**
- [ ] Header visível em todas as páginas
- [ ] Links no header refletem página atual (active state)
- [ ] Tap targets ≥ 40x40px em mobile
- [ ] Menu hamburger acessível (aria-expanded, aria-label)
- [ ] Navigation keyboard-funcional (Tab, Enter, Escape)
- [ ] Footer visível em todas as páginas

---

### Feature 7: SEO & Meta Tags

**Descrição:** Otimização para mecanismos de busca

**User Story:**
- Como dev, quero que o site seja indexado no Google
- Como recrutador no Google, quero encontrar facilmente

**Componentes:**
1. **Meta Tags Dinâmicas por Página**
   - title: "Sênior Software Developer | drebel"
   - description: resumo da página (max 160 chars)
   - keywords: "developer", "angular", "typescript", etc
   - og:title, og:description, og:image (Open Graph)
   - canonical tags

2. **Sitemap & Robots**
   - sitemap.xml (gerado automaticamente)
   - robots.txt com Allow/Disallow

3. **Schema Markup**
   - Person schema (JSON-LD) na home
   - Breadcrumb schema para navegação

4. **Performance Meta**
   - charset: UTF-8
   - viewport: responsive
   - preconnect a fonts/analytics

**Critérios de Aceitação:**
- [ ] Cada página tem meta tags customizadas
- [ ] Open Graph tags preenchidas
- [ ] Sitemap.xml acessível em /sitemap.xml
- [ ] Robots.txt permite crawling de páginas públicas
- [ ] Schema markup válido (teste em schema.org validator)
- [ ] Lighthouse SEO score ≥ 95

---

### Feature 8: Analytics Integration

**Descrição:** Rastreamento de visitantes e comportamento

**User Story:**
- Como dev, quero saber quem visita meu site
- Como dev, quero ver comportamento (páginas, tempos)

**Componentes:**
1. **Google Analytics 4**
   - Tracking ID configurado
   - Eventos: page_view, form_submit, button_click
   - Goals: Contact form submission

2. **Cloudflare Analytics Engine** (opcional)
   - Logs de acesso (automático)
   - Performance metrics
   - Geographic data

3. **Privacy Policy**
   - Disclosure de tracking
   - GDPR compliance (cookie banner se necessário)

**Critérios de Aceitação:**
- [ ] GA4 inicializa em page load
- [ ] Eventos registrados corretamente
- [ ] Sem tracking de dados sensíveis (emails, etc)
- [ ] Privacy policy linked no footer
- [ ] Cloudflare Analytics visível no dashboard

---

### Feature 9: Responsividade & Mobile-First

**Descrição:** Experiência ótima em todos os dispositivos

**Breakpoints:**
- Mobile: 320px - 639px (primary)
- Tablet: 640px - 1023px
- Desktop: 1024px+

**User Story:**
- Como usuário mobile, quero ver todo conteúdo sem overflow
- Como usuário desktop, quero layout otimizado

**Critérios de Aceitação:**
- [ ] Sem scroll horizontal em nenhuma resolução
- [ ] Touch targets ≥ 40x40px em mobile
- [ ] Imagens responsivas (srcset, picture)
- [ ] Font-size ≥ 16px em inputs (sem zoom)
- [ ] Layout fluido ou grid flexível
- [ ] Navigation adaptada para mobile
- [ ] Lighthouse Mobile score ≥ 90

---

### Feature 10: Performance & Core Web Vitals

**Descrição:** Otimização agressiva de performance

**Targets:**
- LCP (Largest Contentful Paint): < 1.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
- Overall Lighthouse: ≥ 95 (todas categorias)

**Componentes de Otimização:**
1. **Imagens**
   - WebP com fallback JPEG/PNG
   - Lazy loading (intersection observer)
   - Compressão agressiva

2. **JavaScript**
   - Code splitting por rota
   - Tree-shaking
   - Minificação e gzip

3. **CSS**
   - Critical CSS inlined
   - Defer non-critical CSS
   - Minificação

4. **Fonts**
   - System font stack (primária)
   - Google Fonts com subsetting (se usado)
   - preload/prefetch estratégico

**Critérios de Aceitação:**
- [ ] Bundle size < 200KB gzipped (sem assets)
- [ ] LCP < 1.5s (FirstView e Repeat)
- [ ] CLS sem mudanças inesperadas
- [ ] Lighthouse PageSpeed ≥ 95
- [ ] Time Interactive < 3s
- [ ] WebPageTest Speed Index < 2.5s

---

## 📋 Estrutura de Dados Global

```yaml
Project:
  name: "drebel-website"
  headline: "Sênior Software Developer"
  
  pages:
    - name: "home"
      route: "/"
    - name: "resume"
      route: "/resume"
    - name: "projects"
      route: "/projects"
    - name: "contact"
      route: "/contact"
  
  content:
    aboutMe: "String"
    professionalSummary: "String"
    skills: [{ category, items }]
    experience: [{ startYear, endYear, company, role, description }]
    projects: [{ title, description, technologies, featured }]
  
  seo:
    defaultTitle: "Sênior Software Developer"
    defaultDescription: "..."
    socialImage: "/og-image.png"
  
  theme:
    darkMode: true
    lightMode: true
    primaryColor: "TBD"
    accentColor: "TBD"
  
  integrations:
    analytics: ["GA4", "Cloudflare"]
    forms: "Formspree"
    deployment: "Cloudflare Pages"
```

---

## 🎨 Design Guidelines (Placeholder)

- **Minimalista:** Sem clutter, foco no conteúdo
- **Animações Moderadas:** ScrollTrigger, hover effects, fade-in
- **Cores:** Paleta a definir (neutral + accent)
- **Tipografia:** System fonts + Google Fonts (se necessário)
- **Espaçamento:** Sistema de grid 8px
- **Acessibilidade:** WCAG 2.1 AA mínimo

---

## ✅ Critérios de Aceitação Globais

- [ ] Todos os links funcionam (404 tratado)
- [ ] Sem console errors em produção
- [ ] Sem console warnings críticos
- [ ] HTTPS enforced (Cloudflare)
- [ ] CSP headers configurados
- [ ] X-Frame-Options e X-Content-Type-Options
- [ ] Lighthouse Score ≥ 95 (Performance, Accessibility, Best Practices, SEO)
- [ ] 100% responsivo (testado em 320px até 2560px)
- [ ] Keyboard navigation funcional (Tab, Enter, Escape)
- [ ] WCAG 2.1 AA compliance

---

## 📊 Priorização de Features

**P0 (MVP - Launch):**
1. Home/Landing page
2. Resume/Currículo
3. Contato (form)
4. Dark/Light mode
5. Navigation + Layout
6. SEO meta tags
7. Mobile-first responsividade
8. Performance (Core Web Vitals)

**P1 (Post-launch):**
1. Analytics (GA4)
2. Projetos (genéricos)
3. Blog (futuro)

**P2 (Nice to have):**
1. Resume PDF download
2. Cloudflare Analytics
3. Advanced animations
4. Sitemap din template âmico

---

## 🚀 Próximos Passos Após Specify

1. Executar `speckit.plan` para criar design artifacts
2. Executar `speckit.tasks` para task breakdown
3. Executar `speckit.implement` para implementação

---

**Criado em:** 2026-07-11
**Versão:** 1.0
**Baseado em:** Entrevista estruturada com usuário
**Status:** Ready for speckit.specify phase
