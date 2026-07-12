export interface SocialLink {
  platform: string
  url: string
  label: string
}

export interface PersonProfile {
  name: string
  headline: string
  summary: string
  email?: string
  location?: string
  socialLinks: SocialLink[]
  ogImage: string
  seo: {
    defaultDescription: string
  }
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface ExperienceEntry {
  id: string
  startYear: number
  endYear: number | null
  company: string
  role: string
  description: string
}

export interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  tags: string[]
  featured: boolean
}

export interface ContactSubmission {
  name: string
  email: string
  message: string
  _gotcha: ''
}

export type Theme = 'light' | 'dark'
