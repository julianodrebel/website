import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { ContentService } from '../../core/services/content.service'
import { IconComponent } from '../../shared/components/icon/icon.component'
import { PersonProfile } from '../../shared/types/content.types'
import { Observable, of } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AsyncPipe } from '@angular/common'

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, IconComponent, AsyncPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly profile$: Observable<PersonProfile | null> =
    this.contentService.profile$.pipe(catchError(() => of(null)))

  readonly currentYear = new Date().getFullYear()

  constructor(private readonly contentService: ContentService) {}
}
