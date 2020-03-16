import {AbstractControl} from '@angular/forms';

export function PasswordCheck(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    if (!control.value.length) {
         Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);
    const q = new Promise((resolve) => {
        this.debouncedTimeout = setTimeout(() => {
            const password: string = '{ "old_password" : "' + this.f.old_password.value + '", "id" : "'
                + this.f.id.value + '" }';
            this.userService.checkOldEmail(password).subscribe(
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
