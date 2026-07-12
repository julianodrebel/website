import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Title, Meta } from '@angular/platform-browser'
import { Observable, of } from 'rxjs'
import { catchError, takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { ContentService } from '../../core/services/content.service'
import { PersonProfile } from '../../shared/types/content.types'
import { ButtonComponent } from '../../shared/components/button/button.component'
import { IconComponent } from '../../shared/components/icon/icon.component'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, AsyncPipe, ButtonComponent, IconComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly profile$: Observable<PersonProfile | null> =
    this.contentService.profile$.pipe(catchError(() => of(null)))

  private readonly destroy$ = new Subject<void>()

  constructor(
    private readonly contentService: ContentService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.contentService.profile$
        .pipe(takeUntil(this.destroy$), catchError(() => of(null)))
        .subscribe((profile) => {
          if (profile) {
            this.setMetaTags(profile)
            this.injectJsonLd(profile)
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
    // Remove JSON-LD script on route change
    if (isPlatformBrowser(this.platformId)) {
      const existing = document.getElementById('json-ld-person')
      if (existing) existing.remove()
    }
  }

  private setMetaTags(profile: PersonProfile): void {
    const title = `${profile.headline} | ${profile.name}`
    const description = profile.seo.defaultDescription
    const imageUrl = `${environment.siteUrl}/${profile.ogImage}`
    const pageUrl = `${environment.siteUrl}/`

    this.titleService.setTitle(title)

    this.metaService.updateTag({ name: 'description', content: description })
    this.metaService.updateTag({ property: 'og:title', content: title })
    this.metaService.updateTag({ property: 'og:description', content: description })
    this.metaService.updateTag({ property: 'og:image', content: imageUrl })
    this.metaService.updateTag({ property: 'og:url', content: pageUrl })
    this.metaService.updateTag({ property: 'og:type', content: 'website' })

    // Canonical link
    if (isPlatformBrowser(this.platformId)) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', pageUrl)
    }
  }

  private injectJsonLd(profile: PersonProfile): void {
    if (!isPlatformBrowser(this.platformId)) return
    const doc = document
    const existing = doc.getElementById('json-ld-person')
    if (existing) return

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      jobTitle: profile.headline,
      url: environment.siteUrl,
      sameAs: profile.socialLinks.map((l) => l.url),
    }

    const script = doc.createElement('script')
    script.id = 'json-ld-person'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    doc.head.appendChild(script)
  }
}
