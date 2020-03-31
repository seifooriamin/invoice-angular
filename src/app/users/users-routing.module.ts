import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {VerifyComponent} from './verify/verify.component';
import {AuthGuard} from '../shared/tools/auth.guard';
import {ProfileComponent} from './profile/profile.component';
import {GeneralSettingComponent} from './general-setting/general-setting.component';
import {ResetPasswordRequestComponent} from './reset-password-request/reset-password-request.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';

const routes: Routes = [
      {path: 'signin', component: SigninComponent},
      {path: 'signup', component: SignupComponent},
      {path: 'forgetpassword', component: ResetPasswordRequestComponent},
      {path: 'resetpassword', component: ResetPasswordComponent},
      {path: 'verify', component: VerifyComponent},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'generalsetting', component: GeneralSettingComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
