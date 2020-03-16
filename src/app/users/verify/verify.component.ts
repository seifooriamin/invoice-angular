import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  token: string;
  sub: Subscription;
  situation = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router,
              private authentication: AuthenticationService) {
      if (this.authentication.currentUserValue) {
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.sub = this.route.queryParams.subscribe(
        (params: Params) => {
          this.token = params['access_code'];
        }
    );

    this.token = '{ "access_code" : "' + this.token + '" }';
    this.userService.emailVerify(this.token).subscribe(
        (response) => {
            if (response['message'] === 'AA') {
            this.situation = 'success';
            } else {
                    if (response['message'] === 'ACNF') {
                        this.situation = 'notFound';
            } else {
                        this.situation = 'failure';
            }
          }
        });
  }

  onSignin() {
      this.router.navigate(['/signin']);
  }

}
