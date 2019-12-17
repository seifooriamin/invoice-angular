import {AbstractControl} from '@angular/forms';

export function CheckEmailExist(control: AbstractControl): Promise<any> {
    // Avoids initial check against an empty string
    if (!control.value.length) {
    Promise.resolve(null);
    }

    clearTimeout(this.debouncedTimeout);

    const q = new Promise((resolve, reject) => {
        this.debouncedTimeout = setTimeout(() => {
            const email: string = '{ "email" : "' + this.f.email.value + '" }';
            this.userService.getEmailExist(email).subscribe(
                (response) => {
                    if (response['message'] === 'new email') {
                        resolve(null);
                        this.emailexist=false;
                    } else {
                        resolve({'usernameUnique': false });
                        this.emailexist = true;
                    }
                });
        }, 300);
    });
    return q;
}
