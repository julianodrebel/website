import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { Router, NavigationEnd } from '@angular/router'
import { filter } from 'rxjs/operators'
import { ThemeService } from './core/services/theme.service'
import { AnalyticsService } from './core/services/analytics.service'
import { HeaderComponent } from './layout/header/header.component'
import { FooterComponent } from './layout/footer/footer.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private readonly themeService: ThemeService,
    private readonly analyticsService: AnalyticsService,
    private readonly router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.themeService.initializeTheme()
      this.themeService.applyTheme()
    }
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        if (isPlatformBrowser(this.platformId)) {
          this.analyticsService.trackPageView(e.urlAfterRedirects)
        }
      })
  }
}
