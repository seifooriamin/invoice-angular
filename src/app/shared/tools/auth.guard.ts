import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        console.log(currentUser);
        if (currentUser) {
            const tokenValidated = this.authenticationService.tokenValidate();
            tokenValidated.then(
                (data => {
                    console.log('showing data value--> ' + data);
                    if ( data === 'TV' ) {
                        console.log('data is true');


                    } else {
                        this.authenticationService.logout();
                    }
                })
            );
            return true;
        }


        this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
