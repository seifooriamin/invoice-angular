import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['../../../my-style.css']
})
export class VerifyComponent implements OnInit, OnDestroy {
  token: string;
  subscription: Subscription;
  successStatus = false;
  failStatus = false;
  errorMessage = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router,
              private authentication: AuthenticationService) {
      if (this.authentication.currentUserValue) {
          this.router.navigate(['/']);
      }
  }
  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

    ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(
        (params: Params) => {
          this.token = params['access_code'];
        }
    );

    this.token = '{ "access_code" : "' + this.token + '" }';
    this.subscription = this.userService.emailVerify(this.token).subscribe(
        () => {
                this.successStatus = true;
                this.errorMessage = '<p class="card-text text-success"><strong>Account Activated,</strong> Your email has been verified, ' +
                    '<a class="stretched-link" href="../users/signin">Sign-in here</a></p>';
            }, (e) => {
                if (e.error.message === 'ACNF') {
                    this.errorMessage = '<p class="card-text text-danger">The activation link is no longer valid, contact ' +
                        '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                    this.failStatus = true;
                } else {
                    this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                        '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                    this.failStatus = true;
                }
        });
  }
}
