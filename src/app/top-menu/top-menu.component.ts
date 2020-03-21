import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../shared/tools/mustmatch.validator';
import {ToolsService} from '../shared/services/tools.service';
import {UserService} from '../shared/services/user.service';
import {PasswordCheck} from '../shared/tools/passwordCheck.validator';
declare var jQuery: any;
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['../../my-style.css']
})
export class TopMenuComponent implements OnInit {
  changePasswordForm: FormGroup;
  currentUser: any;
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  passwordCheck: boolean;
  formInvalidSubmit = false;

  constructor(private authenticationService: AuthenticationService, private formBuilder: FormBuilder,
              private toolsService: ToolsService, private userService: UserService) { }

  ngOnInit() {
    jQuery('ul.navbar-nav li.dropdown').hover(function() {
      // jQuery(this).find('.dropdown-menu').fadeIn(500);
      jQuery(this).find('.dropdown-menu').show();
    },
    function() {
      jQuery(this).find('.dropdown-menu').hide();
    });
    this.initForm();
  }
  initForm() {
    this.changePasswordForm = this.formBuilder.group({
      id: [''],
      old_password: ['', Validators.compose([Validators.required]),
        Validators.composeAsync([PasswordCheck.bind(this)])],
      password: ['', [Validators.required, Validators.pattern('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,15}$')]],
      confirm_new_password: ['', [Validators.required]]
    }, { validator: [MustMatch('password', 'confirm_new_password')]});
  }
  setUserId() {
    this.currentUser = this.toolsService.getUserID();
    this.f.id.setValue(this.currentUser.id);
  }
  onSignOut() {
    this.authenticationService.logout();
  }
  onShowPassChange() {
    this.changePasswordForm.reset();
    this.setUserId();
    jQuery('#modalChangePassword').modal('show');
  }
  onSubmit() {
    if (this.changePasswordForm.valid) {
      this.userService.changePassword(this.changePasswordForm.value).subscribe(
          () => {
            this.submitMessage = 'Password has been changed successfully';
            this.submitMessageStatusSuccess = true;
            this.changePasswordForm.reset();
            this.setUserId();
            const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
            const data =  '{ "email" : "' + jCurrentUser.email + '", "subject" : "Change Password", "name" : "' +
                jCurrentUser.first_name + ' ' + jCurrentUser.last_name + '", "module" : "CP" }';
            this.userService.emailSender(data).subscribe(
                () => {
                }, () => {}
            );
            setTimeout(() => {
              this.submitMessageStatusSuccess = false;
            }, 5000);
          }, () => {
            this.submitMessage = 'Password has not been changed';
            this.submitMessageStatusFail = true;
            setTimeout(() => {
              this.submitMessageStatusFail = false;
            }, 5000);
          }
      );
    } else {
      this.submitMessage = 'Fill all the mandatory fields';
      this.toolsService.markFormGroupTouched(this.changePasswordForm);
      this.submitMessageStatusFail = true;
      this.formInvalidSubmit =  true;
      setTimeout(() => {
        this.submitMessageStatusFail = false;
      }, 5000);
    }

  }
  get f() { return this.changePasswordForm.controls; }

}
