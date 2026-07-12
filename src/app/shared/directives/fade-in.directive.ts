import { Directive, ElementRef, OnInit } from '@angular/core'

@Directive({
  selector: '[appFadeIn]',
  standalone: true,
})
export class FadeInDirective implements OnInit {
  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    const element = this.el.nativeElement
    element.classList.add('card--hidden')

    if (typeof IntersectionObserver === 'undefined') {
      element.classList.add('card--visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.remove('card--hidden')
            element.classList.add('card--visible')
            observer.unobserve(element)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
  }
}
