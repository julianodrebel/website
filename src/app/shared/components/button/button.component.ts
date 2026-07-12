import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="btn"
      [class.btn--primary]="variant === 'primary'"
      [class.btn--secondary]="variant === 'secondary'"
      [disabled]="disabled"
      [type]="type"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      min-height: 44px;
      min-width: 44px;
      padding: 0.625rem 1.5rem;
      border-radius: 6px;
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-semibold);
      border: 2px solid transparent;
      cursor: pointer;
      transition: background-color var(--transition-fast),
        color var(--transition-fast),
        border-color var(--transition-fast),
        box-shadow var(--transition-fast);
      text-decoration: none;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn--primary {
      background-color: var(--color-accent);
      color: #ffffff;
      border-color: var(--color-accent);

      &:hover:not(:disabled) {
        background-color: var(--color-accent-hover);
        border-color: var(--color-accent-hover);
      }
    }

    .btn--secondary {
      background-color: transparent;
      color: var(--color-accent);
      border-color: var(--color-accent);

      &:hover:not(:disabled) {
        background-color: var(--color-accent);
        color: #ffffff;
      }
    }
  `],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary'
  @Input() disabled = false
  @Input() type: 'button' | 'submit' | 'reset' = 'button'
}
