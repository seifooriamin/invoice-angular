import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../shared/services/authentication.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  fillForm: FormGroup;
  returnUrl: string;
  tc: boolean;
  tcm: string;
  error = '';
  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private authentication: AuthenticationService) { }

  ngOnInit() {
    this.fillForm = this.formBuilder.group({
      email: new FormControl('',
          Validators.compose([Validators.required, Validators.email])),
      password: ['', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z]).{6,}')])]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    this.authentication.login(this.fillForm.value).subscribe(
        // (response) => {
        //     console.log(response + this.returnUrl);
        //     this.router.navigate(['dashboard']);
        // }
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.error = error;
          this.loading = false;
        }
    );
  }
  onSignup() {
    this.router.navigate(['signup']);
  }

  get f() { return this.fillForm.controls; }

}
