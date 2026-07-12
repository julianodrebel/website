import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink } from '@angular/router'
import { Title, Meta } from '@angular/platform-browser'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent implements OnInit {
  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('404 — Page Not Found | drebel')
    this.metaService.updateTag({ name: 'robots', content: 'noindex, nofollow' })
  }
}
