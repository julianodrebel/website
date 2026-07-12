import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common'
import { Title, Meta } from '@angular/platform-browser'
import { BehaviorSubject, Observable, combineLatest } from 'rxjs'
import { map, catchError } from 'rxjs/operators'
import { of } from 'rxjs'
import { ContentService } from '../../core/services/content.service'
import { Project } from '../../shared/types/content.types'
import { TagComponent } from '../../shared/components/tag/tag.component'
import { FadeInDirective } from '../../shared/directives/fade-in.directive'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TagComponent, FadeInDirective],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private readonly activeFilter$ = new BehaviorSubject<string | null>(null)

  readonly allProjects$: Observable<Project[]> = this.contentService.projects$.pipe(
    catchError(() => of([]))
  )

  readonly allTags$: Observable<string[]> = this.allProjects$.pipe(
    map((projects) => {
      const tagSet = new Set<string>()
      projects.forEach((p) => p.tags.forEach((t) => tagSet.add(t)))
      return Array.from(tagSet).sort()
    })
  )

  readonly filteredProjects$: Observable<Project[]> = combineLatest([
    this.allProjects$,
    this.activeFilter$,
  ]).pipe(
    map(([projects, filter]) => {
      if (!filter) return projects
      return projects.filter((p) => p.tags.includes(filter))
    })
  )

  constructor(
    private readonly contentService: ContentService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.setMetaTags()
    if (isPlatformBrowser(this.platformId)) {
      this.injectBreadcrumbJsonLd()
    }
  }

  get currentFilter(): string | null {
    return this.activeFilter$.value
  }

  onFilterSelect(tag: string): void {
    const current = this.activeFilter$.value
    this.activeFilter$.next(current === tag ? null : tag)
  }

  clearFilter(): void {
    this.activeFilter$.next(null)
  }

  private setMetaTags(): void {
    const title = 'Projects | drebel'
    const description = 'Browse my open source projects and personal work.'
    this.titleService.setTitle(title)
    this.metaService.updateTag({ name: 'description', content: description })
    this.metaService.updateTag({ property: 'og:title', content: title })
    this.metaService.updateTag({ property: 'og:url', content: `${environment.siteUrl}/projects` })

    if (isPlatformBrowser(this.platformId)) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', `${environment.siteUrl}/projects`)
    }
  }

  private injectBreadcrumbJsonLd(): void {
    if (!isPlatformBrowser(this.platformId)) return
    const doc = document
    if (doc.getElementById('json-ld-breadcrumb-projects')) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: `${environment.siteUrl}/projects`,
        },
      ],
    }
    const script = doc.createElement('script')
    script.id = 'json-ld-breadcrumb-projects'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    doc.head.appendChild(script)
  }
}
