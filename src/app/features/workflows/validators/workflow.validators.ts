import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dueDateNotPastValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return { dueDatePast: { value } };
    }
    return null;
  };
}

export function atLeastOneAssigneeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control.value as string[];
    if (Array.isArray(arr) && arr.length === 0) {
      return { noAssignee: true };
    }
    return null;
  };
}
