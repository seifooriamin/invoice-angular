import {AbstractControl} from '@angular/forms';


export function invalidDate(control: AbstractControl): { [key: string]: any } | null {
    const date: string = control.value;
    console.log(date);
    return null;
    if (date.match('^(([0-2]+\\d{1})|([3]+[0,1]{1}))-([0,1]+\\d{1})-([1-9]{1}\\d{3})$')) {
        return null;
    } else {
        return {invalidDate: true};
    }
}


