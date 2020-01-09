import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../shared/services/user.service';
import {CheckEmailExist} from '../shared/tools/checkemailExist.validator';
import {MustMatch} from '../shared/tools/mustmatch.validator';
import {Router} from '@angular/router';

declare var jQuery:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  fillForm: FormGroup;
  emailexist: boolean = false;
  invalidSubmit: boolean = false;
  modalTitle: string;
  modalBody: string;


  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {}

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
                      this.fillForm.reset();
                      this.modalBody = 'Your account has been successfully registered and verification email has been ' +
                          'sent, to continue please verify your email via the provided link';
                      this.modalTitle = 'Confirmation';
                      jQuery('#modalMessage').modal('show');
                  } else {
                      if (response['message'] === 'UWCENS') {
                          this.modalBody = 'Your account has been successfully registered but verification email has not been ' +
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

  onSignin() {
      this.router.navigate(['/signin']);
  }
}
