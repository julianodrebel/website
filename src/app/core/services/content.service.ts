import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { map } from 'rxjs/operators'
import {
  PersonProfile,
  SkillCategory,
  ExperienceEntry,
  Project,
} from '../../shared/types/content.types'

@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly profile$ = this.http.get<PersonProfile>('assets/data/profile.json')

  readonly skills$ = this.http.get<SkillCategory[]>('assets/data/skills.json')

  readonly experience$ = this.http
    .get<ExperienceEntry[]>('assets/data/experience.json')
    .pipe(map((entries) => [...entries].sort((a, b) => b.startYear - a.startYear)))

  readonly projects$ = this.http.get<Project[]>('assets/data/projects.json')

  constructor(private readonly http: HttpClient) {}
}
