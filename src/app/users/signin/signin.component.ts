import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {Subscription} from 'rxjs';
import {ToolsService} from '../../shared/services/tools.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  // styleUrls: ['../../../styles.css']
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
              private authentication: AuthenticationService, private toolsService: ToolsService) {
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
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.fillForm.valid) {
      this.progressing = true;
      this.subscription = this.authentication.login(this.fillForm.value).subscribe(
          (subscribe) => {
            if (subscribe) {
              this.progressing = false;
              this.router.navigate([this.returnUrl]);
            } else {
              this.errorMessage = '<p class="card-text text-danger"><strong>Username</strong> or ' +
                  '<strong>Password</strong> is incorrect</p>';
              this.progressing = false;
              this.failStatus = true;
            }

          }, () => {}
      );
    } else {
      this.errorMessage = '<p class="card-text text-danger">Enter your <strong>Username</strong> and ' +
          '<strong>Password</strong> first</p>';
      this.failStatus = true;
    }

  }
  whiteSpace(formControl) {
    this.toolsService.whiteSpaceRemover(formControl);
  }
  get f() { return this.fillForm.controls; }

}
