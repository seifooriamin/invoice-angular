import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../shared/tools/mustmatch.validator';
import {ToolsService} from '../../shared/services/tools.service';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../../../my-style.css']
})
export class ResetPasswordComponent implements OnInit {
  successStatus = false;
  accessCodeExisted = false;
  failStatus = false;
  subscription: Subscription;
  accessCode: string;
  resetPasswordForm: FormGroup;
  errorMessage = '';
  fullName = '';
  email = '';
  constructor(private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder,
              private toolsService: ToolsService, private authentication: AuthenticationService, private router: Router) {
      if (this.authentication.currentUserValue) {
          this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.subscription = this.route.queryParams.subscribe(
        (params: Params) => {
          this.accessCode = params['access_code'];
        }
    );
    const data = '{ "access_code" : "' + this.accessCode + '" }';

    this.subscription = this.userService.accessCodeExists(data).subscribe(
        (response) => {
          this.accessCodeExisted = true;
          this.fullName = response['first_name'] + ' ' + response['last_name'];
          this.email = response['email'];
          this.initForm();
          this.f.access_code.setValue(this.accessCode);
        }, () => {
          this.failStatus = true;
          this.errorMessage = '<p class="card-text text-danger"> The reset link is no longer valid, try to receive another link ' +
              '<a href="../users/forgetpassword" > Here</a></p>';
        }
    );
  }
  initForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password : ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$')]],
      confirmPassword: ['', Validators.required],
      access_code : ['']
    }, {validator: [MustMatch('password', 'confirmPassword')]});
  }
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.subscription = this.userService.updatePassword(this.resetPasswordForm.value).subscribe(
          () => {
            this.resetPasswordForm.reset();
            this.successStatus = true;
            this.errorMessage = '<p class="card-text text-success">Your password has been updated, log in' +
                '<a href="../users/signin"> Here</a></p>';
            const data =  '{ "email" : "' + this.email + '", "subject" : "Change Password", "name" : "' +
                  this.fullName + '", "module" : "CP" }';
            this.userService.emailSender(data).subscribe(
                  () => {
                  }, () => {
                }
              );
          }, () => {
              this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                  '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
              this.failStatus = true;
          }
      );
    } else {
      this.toolsService.markFormGroupTouched(this.resetPasswordForm);
    }
  }
  get f() { return this.resetPasswordForm.controls; }

}
