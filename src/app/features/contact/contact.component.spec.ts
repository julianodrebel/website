import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ContactComponent } from './contact.component'
import { provideHttpClient } from '@angular/common/http'
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { AnalyticsService } from '../../core/services/analytics.service'
import { Title, Meta } from '@angular/platform-browser'

describe('ContactComponent', () => {
  let component: ContactComponent
  let fixture: ComponentFixture<ContactComponent>
  let httpMock: HttpTestingController

  const mockAnalyticsService = {
    trackEvent: jasmine.createSpy('trackEvent'),
    trackPageView: jasmine.createSpy('trackPageView'),
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AnalyticsService, useValue: mockAnalyticsService },
        Title,
        Meta,
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ContactComponent)
    component = fixture.componentInstance
    httpMock = TestBed.inject(HttpTestingController)
    fixture.detectChanges()
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form with empty fields', () => {
    const form = component.contactForm
    expect(form.get('name')?.value).toBe('')
    expect(form.get('email')?.value).toBe('')
    expect(form.get('message')?.value).toBe('')
    expect(form.get('_gotcha')?.value).toBe('')
  })

  it('should be invalid when empty', () => {
    expect(component.contactForm.invalid).toBeTrue()
  })

  it('should be valid with correct data', () => {
    component.contactForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message with enough content',
      _gotcha: '',
    })
    expect(component.contactForm.valid).toBeTrue()
  })

  it('should show name error when name is too short', () => {
    const ctrl = component.contactForm.get('name')!
    ctrl.setValue('X')
    ctrl.markAsDirty()
    expect(component.nameError).toContain('at least 2 characters')
  })

  it('should show email error for invalid email', () => {
    const ctrl = component.contactForm.get('email')!
    ctrl.setValue('not-an-email')
    ctrl.markAsDirty()
    expect(component.emailError).toContain('valid email')
  })

  it('should show message error when message is too short', () => {
    const ctrl = component.contactForm.get('message')!
    ctrl.setValue('Short')
    ctrl.markAsDirty()
    expect(component.messageError).toContain('at least 10 characters')
  })

  it('should not submit when form is invalid', () => {
    component.onSubmit()
    expect(component.formStatus).toBe('idle')
  })

  it('should set submitting status on valid submit', () => {
    component.contactForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a valid test message',
      _gotcha: '',
    })
    component.onSubmit()
    expect(component.formStatus).toBe('submitting')
    httpMock.expectOne((req) => req.url.includes('formspree.io')).flush({})
  })

  it('should show success after successful submission', () => {
    component.contactForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a valid test message for submission',
      _gotcha: '',
    })
    component.onSubmit()
    httpMock.expectOne((req) => req.url.includes('formspree.io')).flush({})
    expect(component.formStatus).toBe('success')
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('form_submit', {
      form_id: 'contact',
    })
  })

  it('should show error status on failed submission', () => {
    component.contactForm.setValue({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a valid test message for error case',
      _gotcha: '',
    })
    component.onSubmit()
    httpMock
      .expectOne((req) => req.url.includes('formspree.io'))
      .flush('Error', { status: 500, statusText: 'Server Error' })
    expect(component.formStatus).toBe('error')
  })

  it('should reset to idle on retryForm()', () => {
    component.formStatus = 'error'
    component.retryForm()
    expect(component.formStatus).toBe('idle')
  })
})
