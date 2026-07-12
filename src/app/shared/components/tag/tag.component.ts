import { Component, Input, Output, EventEmitter } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="tag"
      [class.tag--interactive]="interactive"
      [class.tag--active]="active"
      (click)="interactive ? selected.emit(label) : null"
      [attr.role]="interactive ? 'button' : null"
      [attr.tabindex]="interactive ? 0 : null"
      (keydown.enter)="interactive ? selected.emit(label) : null"
      (keydown.space)="interactive ? selected.emit(label) : null"
    >{{ label }}</span>
  `,
  styles: [`
    .tag {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-medium);
      border-radius: 9999px;
      background-color: var(--color-bg-secondary);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border);
      white-space: nowrap;
      line-height: 1.5;
      min-height: 28px;
    }

    .tag--interactive {
      cursor: pointer;
      transition: background-color var(--transition-fast), color var(--transition-fast);

      &:hover,
      &:focus-visible {
        background-color: var(--color-accent);
        color: #ffffff;
        border-color: var(--color-accent);
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }
    }

    .tag--active {
      background-color: var(--color-accent);
      color: #ffffff;
      border-color: var(--color-accent);
    }
  `],
})
export class TagComponent {
  @Input({ required: true }) label = ''
  @Input() interactive = false
  @Input() active = false
  @Output() selected = new EventEmitter<string>()
}
