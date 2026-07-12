import { Injectable } from '@angular/core'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  trackPageView(path: string): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', { page_path: path })
    }
  }

  trackEvent(eventName: string, params?: Record<string, unknown>): void {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params)
    }
  }
}
