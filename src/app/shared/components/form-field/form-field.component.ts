import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="form-field" [class.form-field--error]="showError">
      <label class="form-field__label" [for]="fieldId">
        {{ label }}
        <span *ngIf="required" class="form-field__required" aria-hidden="true">*</span>
      </label>
      <ng-content></ng-content>
      <span
        *ngIf="showError && errorMessage"
        class="form-field__error"
        [id]="fieldId + '-error'"
        role="alert"
        aria-live="polite"
      >
        {{ errorMessage }}
      </span>
    </div>
  `,
  styles: [`
    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      margin-bottom: var(--spacing-md);
    }

    .form-field__label {
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-primary);
    }

    input,
    textarea {
      font-size: 1rem; /* ≥16px — prevents iOS auto-zoom */
    }

    .form-field__required {
      color: var(--color-error);
      margin-left: 2px;
    }

    .form-field__error {
      font-size: var(--font-size-small);
      color: var(--color-error);
      margin-top: 2px;
    }

    :host ::ng-deep input,
    :host ::ng-deep textarea {
      width: 100%;
      padding: 0.625rem var(--spacing-md);
      font-size: 1rem; // ≥16px — prevents iOS auto-zoom
      border: 1.5px solid var(--color-border);
      border-radius: 6px;
      background-color: var(--color-bg-primary);
      color: var(--color-text-primary);
      transition: border-color var(--transition-fast);
      line-height: var(--line-height-normal);

      &:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.15);
      }
    }

    .form-field--error :host ::ng-deep input,
    .form-field--error :host ::ng-deep textarea {
      border-color: var(--color-error);
    }
  `],
})
export class FormFieldComponent {
  @Input({ required: true }) fieldId = ''
  @Input({ required: true }) label = ''
  @Input() required = false
  @Input() control: AbstractControl | null = null
  @Input() errorMessage: string | null = null

  get showError(): boolean {
    return !!(
      this.control &&
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    )
  }
}
