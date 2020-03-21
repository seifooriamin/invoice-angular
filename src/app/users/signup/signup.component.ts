import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../shared/services/user.service';
import {CheckEmailExist} from '../../shared/tools/checkemailExist.validator';
import {MustMatch} from '../../shared/tools/mustmatch.validator';
import {Router} from '@angular/router';
import {InvoiceGeneralSettingService} from '../../shared/services/invoice-general-setting.service';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Subscription} from 'rxjs';
import {ToolsService} from '../../shared/services/tools.service';

declare var jQuery: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../../../my-style.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  fillForm: FormGroup;
  emailexist = false;
  userID: string;
  successStatus = false;
  failStatus = false;
  errorMessage = '';
  subscription: Subscription;
  progressing = false;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router,
              private invoiceGeneralSettingService: InvoiceGeneralSettingService, private authentication: AuthenticationService,
              private toolsService: ToolsService) {
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
    this.initForm();
  }
  initForm() {
      this.fillForm = this.formBuilder.group({
          first_name: ['', [Validators.required, Validators.maxLength(50),
              Validators.pattern('^[a-zA-Z\\ *\\-*]*$')]],
          // firstName: ['', Validators.required],
          last_name: ['', [Validators.required, Validators.maxLength(50),
              Validators.pattern('^[a-zA-Z\\ *\\-*]*$')]],
          email: ['', Validators.compose([Validators.required, Validators.email]),
              Validators.composeAsync([CheckEmailExist.bind(this)])],
          password: ['', Validators.compose([Validators.required,
              Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$')])],
          confirmPassword: ['', Validators.required],
          // confirm_email: new FormControl('', [Validators.required, Validators.email]),
          confirmEmail: new FormControl('', [Validators.required]),
      }, {
          validator: [MustMatch('password', 'confirmPassword'),
              MustMatch('email', 'confirmEmail')]
      });
  }
  onSubmit() {
      if (this.fillForm.valid) {
          this.progressing = true;
          this.subscription = this.userService.userCreate(this.fillForm.value).subscribe(
              () => {
                  const emailJson = '{ "email" : "' + this.f.email.value + '" }';
                  this.subscription = this.userService.getLastUserID(emailJson).subscribe(
                      (response) => {
                          this.userID = '{ "user_id" : "' + response['id'] + '" }';
                          const fullName = this.f.first_name.value + ' ' + this.f.last_name.value;
                          const accessCode = response['access_code'];
                          this.subscription = this.invoiceGeneralSettingService.createInvoiceSetting(this.userID).subscribe(
                              () => {
                                  const data =  '{ "email" : "' + this.f.email.value + '", "subject" : "Activation Email", ' +
                                      '"name" : "' + fullName + '", "module" : "AE", "token" : "' + accessCode + '" }';
                                  this.subscription = this.userService.emailSender(data).subscribe(
                                      () => {
                                          this.fillForm.reset();
                                          this.successStatus = true;
                                          this.progressing = false;
                                          this.errorMessage = '<p class="card-text text-success">' +
                                              'Your account has been successfully created, your activation email has been ' +
                                              'sent, to complete your sign up check your email.<br>' +
                                              'If you will not receive your activation email in your Inbox shortly, ' +
                                              'check your Spam box</p>';
                                      }, () => {
                                          this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                                              '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                                          this.failStatus = true;
                                          this.progressing = false;
                                      });
                                  }, () => {
                                  this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                                      '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                                  this.failStatus = true;
                                  this.progressing = false;
                              });
                      }, () => {
                          this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                              '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                          this.failStatus = true;
                          this.progressing = false;
                      });
              }, () => {
                  this.errorMessage = '<p class="card-text text-danger">Unexpected error, contact ' +
                      '<a href="mailto: userservice@einvoicemaker.com">User Services</a></p>';
                  this.failStatus = true;
                  this.progressing = false;
              });
      } else {
          this.toolsService.markFormGroupTouched(this.fillForm);
      }

  }
  get f() { return this.fillForm.controls; }

}
