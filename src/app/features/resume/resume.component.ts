import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, AsyncPipe, isPlatformBrowser } from '@angular/common'
import { Title, Meta } from '@angular/platform-browser'
import { Observable, combineLatest, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ContentService } from '../../core/services/content.service'
import { PersonProfile, SkillCategory, ExperienceEntry } from '../../shared/types/content.types'
import { TagComponent } from '../../shared/components/tag/tag.component'
import { environment } from '../../../environments/environment'

interface ResumeData {
  profile: PersonProfile
  skills: SkillCategory[]
  experience: ExperienceEntry[]
}

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule, AsyncPipe, TagComponent],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss',
})
export class ResumeComponent implements OnInit {
  readonly resumeData$: Observable<ResumeData | null> = combineLatest({
    profile: this.contentService.profile$,
    skills: this.contentService.skills$,
    experience: this.contentService.experience$,
  }).pipe(catchError(() => of(null)))

  constructor(
    private readonly contentService: ContentService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.contentService.profile$
        .pipe(catchError(() => of(null)))
        .subscribe((profile) => {
          if (profile) this.setMetaTags(profile)
        })
      this.injectBreadcrumbJsonLd()
    }
  }

  getYearRange(entry: ExperienceEntry): string {
    const end = entry.endYear === null ? 'Present' : entry.endYear.toString()
    return `${entry.startYear} – ${end}`
  }

  private setMetaTags(profile: PersonProfile): void {
    const title = `Resume — ${profile.headline} | ${profile.name}`
    const description = `Online resume of ${profile.name} — ${profile.headline}. View experience, skills, and qualifications.`
    const pageUrl = `${environment.siteUrl}/resume`

    this.titleService.setTitle(title)
    this.metaService.updateTag({ name: 'description', content: description })
    this.metaService.updateTag({ name: 'keywords', content: 'resume, experience, skills, developer' })
    this.metaService.updateTag({ property: 'og:title', content: title })
    this.metaService.updateTag({ property: 'og:description', content: description })
    this.metaService.updateTag({ property: 'og:url', content: pageUrl })

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

  private injectBreadcrumbJsonLd(): void {
    if (!isPlatformBrowser(this.platformId)) return
    const doc = document
    if (doc.getElementById('json-ld-breadcrumb-resume')) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Resume', item: `${environment.siteUrl}/resume` },
      ],
    }
    const script = doc.createElement('script')
    script.id = 'json-ld-breadcrumb-resume'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    doc.head.appendChild(script)
  }
}
