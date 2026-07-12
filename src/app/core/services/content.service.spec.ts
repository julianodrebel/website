import { TestBed } from '@angular/core/testing'
import { ContentService } from './content.service'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { PersonProfile, SkillCategory, ExperienceEntry, Project } from '../../shared/types/content.types'

describe('ContentService', () => {
  let service: ContentService
  let httpMock: HttpTestingController

  const mockProfile: PersonProfile = {
    name: 'Test User',
    headline: 'Test Headline',
    summary: 'Test summary',
    location: 'Test City',
    email: 'test@example.com',
    ogImage: 'og-image.png',
    seo: { defaultDescription: 'Test SEO' },
    socialLinks: [],
  }

  const mockSkills: SkillCategory[] = [
    { category: 'Frontend', items: ['Angular', 'TypeScript'] },
  ]

  const mockExperience: ExperienceEntry[] = [
    {
      id: 'exp-1',
      role: 'Engineer',
      company: 'ACME',
      description: 'Did things',
      startYear: 2022,
      endYear: null,
    },
    {
      id: 'exp-2',
      role: 'Junior Engineer',
      company: 'Corp',
      description: 'Learned things',
      startYear: 2019,
      endYear: 2022,
    },
  ]

  const mockProjects: Project[] = [
    {
      id: 'proj-1',
      title: 'My App',
      description: 'An app',
      tags: ['Angular'],
      featured: true,
    },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService, provideHttpClient(), provideHttpClientTesting()],
    })
    service = TestBed.inject(ContentService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should load profile from assets', () => {
    let result: PersonProfile | undefined
    service.profile$.subscribe((p) => (result = p))
    httpMock.expectOne('assets/data/profile.json').flush(mockProfile)
    expect(result?.name).toBe('Test User')
  })

  it('should load skills from assets', () => {
    let result: SkillCategory[] | undefined
    service.skills$.subscribe((s) => (result = s))
    httpMock.expectOne('assets/data/skills.json').flush(mockSkills)
    expect(result?.length).toBe(1)
  })

  it('should sort experience by startYear descending', () => {
    let result: ExperienceEntry[] | undefined
    service.experience$.subscribe((e) => (result = e))
    httpMock.expectOne('assets/data/experience.json').flush(mockExperience)
    expect(result?.[0].startYear).toBeGreaterThanOrEqual(result?.[1].startYear ?? 0)
  })

  it('should load projects from assets', () => {
    let result: Project[] | undefined
    service.projects$.subscribe((p) => (result = p))
    httpMock.expectOne('assets/data/projects.json').flush(mockProjects)
    expect(result?.length).toBe(1)
  })
})
