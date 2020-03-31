import { Injectable } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {LocationStrategy} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(private locationStrategy: LocationStrategy) { }

  imageAccept(imageType: string) {
    if ((imageType === 'image/gif') || (imageType === 'image/jpeg') || (imageType === 'image/png')) {
      return true;
    } else {
      return false;
    }
  }
  imageSize(imageSize) {
    if (imageSize <= 2097152) {
      return true;
    } else {
      return  false;
    }
  }
  showNumberWithDecimal(num): number {
    num = Math.abs(Number(num) || 0);
    num = num.toFixed(2);
    return num;
  }
  numberCorrection(num): number {
      num = Math.abs(Number(num) || 0);
      return num;
  }
  numberSeparator(value): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  getUserIDJson(): string {
    const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    return  '{ "user_id" : "' + jCurrentUser['id'] + '" }';
  }
  getUserID(): string {
    const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    return  jCurrentUser;
  }
  markFormGroupTouched(form: FormGroup) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  whiteSpaceRemover(formControl: FormControl) {
    formControl.setValue(formControl.value.trim());
  }
  disableBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

}
