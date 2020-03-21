import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {init} from 'protractor/built/launcher';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../../../my-style.css']
})
export class SigninComponent implements OnInit, OnDestroy {
  fillForm: FormGroup;
  returnUrl: string;
  failStatus = false;
  subscription: Subscription;
  errorMessage = '';
  progressing = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authentication: AuthenticationService) {
    if (this.authentication.currentUserValue) {
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      this.router.navigate([this.returnUrl]);
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  initForm() {
    this.fillForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.fillForm.value) {
      this.progressing = true;
      this.subscription = this.authentication.login(this.fillForm.value).subscribe(
          () => {
            this.progressing = false;
            this.router.navigate([this.returnUrl]);
          },
          () => {
            this.progressing = false;
            this.errorMessage = '<p class="card-text text-danger">Your username or password is incorrect</a></p>';
            this.failStatus = true;
          }
      );
    }

  }
  get f() { return this.fillForm.controls; }

}
