import { AbstractControl, ValidationErrors } from '@angular/forms';

export function duiValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const digitsOnly = value.replace(/\D/g, '');
  if (digitsOnly.length !== 9) {
    return { invalidDui: true };
  }

  return null;
}