import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../shared/services/user.service';
import {CheckEmailExist} from '../shared/tools/checkemailExist.validator';
import {MustMatch} from '../shared/tools/mustmatch.validator';
import {Router} from '@angular/router';
import {InvoiceGeneralSettingService} from '../shared/services/invoice-general-setting.service';

declare var jQuery: any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fillForm: FormGroup;
  emailexist = false;
  invalidSubmit = false;
  modalTitle: string;
  modalBody = '';
  userID: string;


  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router,
              private invoiceGeneralSettingService: InvoiceGeneralSettingService) {}

  ngOnInit() {
    // this.initForm();
      this.fillForm = this.formBuilder.group({
          first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),
              Validators.pattern('(?=.*[a-zA-Z]).{2,}')]],
          // firstName: ['', Validators.required],
          last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),
              Validators.pattern('(?=.*[a-zA-Z]).{2,}')]],
          email: new FormControl('',
              Validators.compose([Validators.required, Validators.email]),
              Validators.composeAsync([CheckEmailExist.bind(this)])),
          password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15),
              Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{6,}')])],
          confirmPassword: ['', Validators.required],
          // confirm_email: new FormControl('', [Validators.required, Validators.email]),
          confirmEmail: new FormControl('',[Validators.required, Validators.email]),
          contact_number: new FormControl(''),
          address1: new FormControl(''),
          address2: new FormControl(''),
          city: new FormControl(''),
          province: new FormControl(''),
          country: new FormControl(''),
          postal_code: new FormControl('')
      }, {
          validator: [MustMatch('password', 'confirmPassword'),
                      MustMatch('email', 'confirmEmail')]
      });
  }


  onSubmit() {
      if (this.fillForm.invalid) {
          this.invalidSubmit = true;
            setTimeout(() => {
              this.invalidSubmit = false;
                 }, 2000);
          return;
      } else {
          this.userService.userCreate(this.fillForm.value).subscribe(
              (response) => {
                  if (response['message'] === 'UWCES') {
                      this.onCreateUserSetting();
                      this.fillForm.reset();
                      this.modalBody += 'Your account has been successfully registered and verification email has been ' +
                          'sent, to continue please verify your email via the provided link';
                      this.modalTitle = 'Confirmation';
                      jQuery('#modalMessage').modal('show');
                  } else {
                      if (response['message'] === 'UWCENS') {
                          this.onCreateUserSetting();
                          this.fillForm.reset();
                          this.modalBody += 'Your account has been successfully registered but verification email has not been ' +
                              'sent, to continue please contact submit@einvoicemaker.com';
                          this.modalTitle = 'Confirmation - Verify Fail';
                          jQuery('#modalMessage').modal('show');
                      } else {
                          this.modalBody = 'Due to technical issue your account has not been registered, ' +
                              'please contact submit@einvoicemaker.com';
                          this.modalTitle = 'Failure';
                          jQuery('#modalMessage').modal('show');
                      }
                  }
                  }
          );
      }

  }
  get f() { return this.fillForm.controls; }
  onCreateUserSetting() {
      this.userService.getLastUserID().subscribe(
          (response) => {
              this.userID = '{ "user_id" : "' + response['ID'] + '" }';
              this.invoiceGeneralSettingService.createInvoiceSetting(this.userID).subscribe(
                  (message) => {
                      if (message['message'] === 'SUCCESS') {
                          this.modalBody += '-';
                      }
                  }, (err) => {
                      this.modalBody += '*';
                  }
              );
          }, (e) => {
          }
      );

  }
  onSignin() {
      this.router.navigate(['/signin']);
  }
}
