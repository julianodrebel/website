import { TestBed } from '@angular/core/testing'
import { ThemeService } from './theme.service'
import { DOCUMENT } from '@angular/common'

describe('ThemeService', () => {
  let service: ThemeService
  let documentEl: Document

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ThemeService],
    })
    service = TestBed.inject(ThemeService)
    documentEl = TestBed.inject(DOCUMENT)
    // Clear stored preference between tests
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('theme-preference')
    }
    documentEl.documentElement.removeAttribute('data-theme')
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should have a default theme', () => {
    expect(service.currentTheme).toMatch(/^(light|dark)$/)
  })

  it('should toggle theme from light to dark', () => {
    service.applyTheme()
    const initial = service.currentTheme
    service.toggleTheme()
    const toggled = service.currentTheme
    expect(toggled).not.toBe(initial)
  })

  it('should toggle theme back after two toggles', () => {
    service.applyTheme()
    const initial = service.currentTheme
    service.toggleTheme()
    service.toggleTheme()
    expect(service.currentTheme).toBe(initial)
  })

  it('should emit theme changes via theme$ observable', (done) => {
    const emissions: string[] = []
    service.theme$.subscribe((t) => emissions.push(t))
    service.toggleTheme()
    expect(emissions.length).toBeGreaterThanOrEqual(1)
    done()
  })
})
