import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './signin/signin.component';
import {SignupComponent} from './signup/signup.component';
import {VerifyComponent} from './verify/verify.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './shared/tools/auth.guard';
import {UsersComponent} from './users/users.component';
import {CompanyComponent} from './company/company.component';
import {CompanyListComponent} from './company/company-list/company-list.component';
import {AddModifyComponent} from './company/add-modify/add-modify.component';


const routes: Routes = [
  {path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'company', component: CompanyComponent, canActivate: [AuthGuard], children: [
      {path: 'company-list', component: CompanyListComponent},
      {path: 'new', component: AddModifyComponent},
      {path: ':id', component: AddModifyComponent},
      {path: ':id/modify', component: AddModifyComponent},

    ]},
  {path: 'users', component: UsersComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'verify', component: VerifyComponent},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
