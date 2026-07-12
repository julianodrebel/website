import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { RouterLink, RouterLinkActive, Router } from '@angular/router'
import { ThemeService } from '../../core/services/theme.service'
import { IconComponent } from '../../shared/components/icon/icon.component'
import { Theme } from '../../shared/types/content.types'

interface NavLink {
  label: string
  route: string
  exact: boolean
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false
  private hamburgerButtonEl: HTMLElement | null = null
  private escapeListener: ((e: KeyboardEvent) => void) | null = null

  readonly navLinks: NavLink[] = [
    { label: 'Home', route: '/', exact: true },
    { label: 'Currículo', route: '/resume', exact: false },
    { label: 'Projetos', route: '/projects', exact: false },
    { label: 'Contato', route: '/contact', exact: false },
  ]

  constructor(
    private readonly themeService: ThemeService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.escapeListener = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.menuOpen) {
          this.closeMenu()
        }
      }
      document.addEventListener('keydown', this.escapeListener)
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.escapeListener) {
      document.removeEventListener('keydown', this.escapeListener)
    }
  }

  get currentTheme(): Theme {
    return this.themeService.currentTheme
  }

  get themeToggleLabel(): string {
    return this.currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
  }

  get themeIcon(): string {
    return this.currentTheme === 'dark' ? 'sun' : 'moon'
  }

  toggleTheme(): void {
    this.themeService.toggleTheme()
  }

  onHamburgerClick(event: MouseEvent): void {
    this.hamburgerButtonEl = event.currentTarget as HTMLElement
    this.menuOpen = !this.menuOpen
  }

  closeMenu(): void {
    this.menuOpen = false
    // Return focus to hamburger button after menu closes
    if (this.hamburgerButtonEl) {
      this.hamburgerButtonEl.focus()
      this.hamburgerButtonEl = null
    }
  }

  onNavLinkClick(): void {
    if (this.menuOpen) {
      this.closeMenu()
    }
  }

  isCurrentRoute(route: string, exact: boolean): boolean {
    if (exact) return this.router.url === route
    return this.router.url.startsWith(route)
  }
}
