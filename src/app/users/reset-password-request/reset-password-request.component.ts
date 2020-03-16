import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {Subscription} from 'rxjs';
import {ToolsService} from '../../shared/services/tools.service';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-reset-password-request',
  templateUrl: './reset-password-request.component.html',
  styleUrls: ['../../../my-style.css']
})
export class ResetPasswordRequestComponent implements OnInit, OnDestroy {
  forgetPasswordForm: FormGroup;
  failStatus = false;
  successStatus = false;
  subscription: Subscription;
  errorMessage = '';
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService,
              private toolsService: ToolsService, private authentication: AuthenticationService) {
      if (this.authentication.currentUserValue) {
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.initForm();
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initForm() {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      this.subscription = this.userService.getEmailExist(this.forgetPasswordForm.value).subscribe(
          (response) => {
            if (response['message'] === 'email exist') {
              this.subscription = this.userService.updateAccessCode(this.forgetPasswordForm.value).subscribe(
                  (updateResponse) => {
                    const data =  '{ "email" : "' + this.f.email.value + '", "subject" : "Reset Password", "name" : "' +
                        response['first_name'] + ' ' + response['last_name'] + '", "module" : "RP", "token": "' +
                        updateResponse['message'] + '" }';
                    this.userService.emailSender(data).subscribe(
                        () => {
                          this.forgetPasswordForm.reset();
                          this.successStatus = true;
                          this.errorMessage = '<p class="card-text text-success">Reset Password link has been sent to your email</p>';
                        }, () => {
                            this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                                '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                            this.failStatus = true;
                        }
                    );

                  }, () => {
                    this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                        '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                    this.failStatus = true;
                  }
              );
            } else {
              this.errorMessage = '<p class="card-text text-danger">We cannot find an account with that e-mail address</p>';
              this.failStatus = true;
              setTimeout( () => {
                this.failStatus = false;
              }, 5000);
            }
          }, () => {
            this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
            this.failStatus = true;
          }
      );
    } else {
      this.toolsService.markFormGroupTouched(this.forgetPasswordForm);
    }
  }
  get f() { return this.forgetPasswordForm.controls; }

}
