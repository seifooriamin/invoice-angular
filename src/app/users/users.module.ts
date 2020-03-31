import { NgModule } from '@angular/core';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {VerifyComponent} from './verify/verify.component';
import {UsersComponent} from './users.component';
import {ProfileComponent} from './profile/profile.component';
import {GeneralSettingComponent} from './general-setting/general-setting.component';
import {ResetPasswordRequestComponent} from './reset-password-request/reset-password-request.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {SharedModule} from '../shared/module/shared.module';
import {UsersRoutingModule} from './users-routing.module';



@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    VerifyComponent,
    UsersComponent,
    ProfileComponent,
    GeneralSettingComponent,
    ResetPasswordRequestComponent,
    ResetPasswordComponent,

  ],
  imports: [
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
