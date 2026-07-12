import { Injectable, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { BehaviorSubject } from 'rxjs'
import { Theme } from '../../shared/types/content.types'

const THEME_KEY = 'theme-preference'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId: Object
  private readonly themeSubject = new BehaviorSubject<Theme>('light')

  /** Observable alias kept for spec compatibility */
  readonly theme$ = this.themeSubject.asObservable()
  readonly currentTheme$ = this.themeSubject.asObservable()

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.platformId = platformId
  }

  get currentTheme(): Theme {
    return this.themeSubject.value
  }

  getThemePreference(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light'
    }
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(THEME_KEY)
      if (saved === 'dark' || saved === 'light') return saved
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const initialTheme = this.getThemePreference()
      this.themeSubject.next(initialTheme)
    }
  }

  applyTheme(theme: Theme = this.currentTheme): void {
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  toggleTheme(): void {
    const next: Theme = this.themeSubject.value === 'dark' ? 'light' : 'dark'
    this.themeSubject.next(next)
    if (isPlatformBrowser(this.platformId) && typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, next)
    }
    this.applyTheme(next)
  }
}
