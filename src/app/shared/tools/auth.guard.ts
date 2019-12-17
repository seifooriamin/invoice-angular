﻿import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';
import {UserService} from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            const tokenValidated = this.authenticationService.tokenValidate();
            tokenValidated.then(
                (data => {
                    if ( data === 'TV' ) {
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
