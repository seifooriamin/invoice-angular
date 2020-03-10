import {AbstractControl} from '@angular/forms';

export function PasswordCheck(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    if (!control.value.length) {
         Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve) => {
        this.debouncedTimeout = setTimeout(() => {
            this.userService.checkOldEmail(this.changePasswordForm.value).subscribe(
                (response) => {
                    if (response['message'] === 'PASSWORDOK') {
                        resolve(null);
                        this.passwordCheck = false;
                    } else {
                        resolve({'passwordIncorrect': false });
                        this.passwordCheck = true;
                    }
                });
        }, 300);
    });
    return q;
}
