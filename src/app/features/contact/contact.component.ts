import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Title, Meta } from '@angular/platform-browser'
import { FormFieldComponent } from '../../shared/components/form-field/form-field.component'
import { ButtonComponent } from '../../shared/components/button/button.component'
import { AnalyticsService } from '../../core/services/analytics.service'
import { environment } from '../../../environments/environment'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup
  formStatus: FormStatus = 'idle'

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit(): void {
    this.buildForm()
    this.setMetaTags()
    if (isPlatformBrowser(this.platformId)) {
      this.injectBreadcrumbJsonLd()
    }
  }

  get nameControl(): AbstractControl {
    return this.contactForm.get('name')!
  }
  get emailControl(): AbstractControl {
    return this.contactForm.get('email')!
  }
  get messageControl(): AbstractControl {
    return this.contactForm.get('message')!
  }

  get nameError(): string {
    const ctrl = this.nameControl
    if (!ctrl.dirty) return ''
    if (ctrl.hasError('required')) return 'Name is required'
    if (ctrl.hasError('minlength')) return 'Name must be at least 2 characters'
    return ''
  }

  get emailError(): string {
    const ctrl = this.emailControl
    if (!ctrl.dirty) return ''
    if (ctrl.hasError('required')) return 'Email is required'
    if (ctrl.hasError('email')) return 'Enter a valid email address'
    return ''
  }

  get messageError(): string {
    const ctrl = this.messageControl
    if (!ctrl.dirty) return ''
    if (ctrl.hasError('required')) return 'Message is required'
    if (ctrl.hasError('minlength')) return 'Message must be at least 10 characters'
    return ''
  }

  get isSubmitting(): boolean {
    return this.formStatus === 'submitting'
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched()
      return
    }

    this.formStatus = 'submitting'
    const { name, email, message, _gotcha } = this.contactForm.value

    const payload = { name, email, message, _gotcha }
    const headers = new HttpHeaders({ Accept: 'application/json' })
    const url = `https://formspree.io/f/${environment.formspreeId}`

    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        this.formStatus = 'success'
        this.contactForm.reset()
        this.analyticsService.trackEvent('form_submit', { form_id: 'contact' })
      },
      error: () => {
        this.formStatus = 'error'
      },
    })
  }

  retryForm(): void {
    this.formStatus = 'idle'
  }

  private buildForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
      _gotcha: [''], // Honeypot
    })
  }

  private setMetaTags(): void {
    this.titleService.setTitle('Contato | drebel')
    this.metaService.updateTag({
      name: 'description',
      content: 'Entre em contato comigo via formulário.',
    })
    this.metaService.updateTag({ property: 'og:title', content: 'Contato | drebel' })
    this.metaService.updateTag({
      property: 'og:url',
      content: `${environment.siteUrl}/contact`,
    })

    if (isPlatformBrowser(this.platformId)) {
      let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', `${environment.siteUrl}/contact`)
    }
  }

  private injectBreadcrumbJsonLd(): void {
    if (!isPlatformBrowser(this.platformId)) return
    const doc = document
    if (doc.getElementById('json-ld-breadcrumb-contact')) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: environment.siteUrl },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contato',
          item: `${environment.siteUrl}/contact`,
        },
      ],
    }
    const script = doc.createElement('script')
    script.id = 'json-ld-breadcrumb-contact'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    doc.head.appendChild(script)
  }
}
