import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SigninComponent} from './users/signin/signin.component';
import {SignupComponent} from './users/signup/signup.component';
import {VerifyComponent} from './users/verify/verify.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './shared/tools/auth.guard';
import {UsersComponent} from './users/users.component';
import {CompanyComponent} from './company/company.component';
import {CompanyListComponent} from './company/company-list/company-list.component';
import {AddModifyComponent} from './company/add-modify/add-modify.component';
import {CustomerComponent} from './customer/customer.component';
import {CustomerListComponent} from './customer/customer-list/customer-list.component';
import {AddModifyViewComponent} from './customer/add-modify-view/add-modify-view.component';
import {InvoiceComponent} from './invoice/invoice.component';
import {InvoiceListComponent} from './invoice/invoice-list/invoice-list.component';
import {InvoiceAddViewModifyComponent} from './invoice/invoice-add-view-modify/invoice-add-view-modify.component';
import {EstimateComponent} from './estimate/estimate.component';
import {EstimateListComponent} from './estimate/estimate-list/estimate-list.component';
import {EstimateAddViewModifyComponent} from './estimate/estimate-add-view-modify/estimate-add-view-modify.component';
import {ProfileComponent} from './users/profile/profile.component';
import {GeneralSettingComponent} from './users/general-setting/general-setting.component';



const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'company', component: CompanyComponent, canActivate: [AuthGuard], children: [
      {path: 'company-list', component: CompanyListComponent},
      {path: 'new', component: AddModifyComponent},
      {path: ':id', component: AddModifyComponent},
      {path: ':id/modify', component: AddModifyComponent},

    ]},
  {path: 'customer', component: CustomerComponent, canActivate: [AuthGuard], children: [
      {path: 'customer-list', component: CustomerListComponent},
      {path: 'new', component: AddModifyViewComponent},
      {path: ':id', component: AddModifyViewComponent},
      {path: ':id/modify', component: AddModifyViewComponent},

    ]},
  {path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard], children: [
      {path: 'invoice-list', component: InvoiceListComponent},
      {path: 'new', component: InvoiceAddViewModifyComponent},
      {path: ':id', component: InvoiceAddViewModifyComponent},
      {path: ':id/modify', component: InvoiceAddViewModifyComponent},

    ]},
  {path: 'estimate', component: EstimateComponent, canActivate: [AuthGuard], children: [
      {path: 'estimate-list', component: EstimateListComponent},
      {path: 'new', component: EstimateAddViewModifyComponent},
      {path: ':id', component: EstimateAddViewModifyComponent},
      {path: ':id/modify', component: EstimateAddViewModifyComponent},

    ]},
  {path: 'users', component: UsersComponent, children: [
          {path: 'signin', component: SigninComponent},
          {path: 'signup', component: SignupComponent},
          {path: 'verify', component: VerifyComponent},
          {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
          {path: 'generalsetting', component: GeneralSettingComponent, canActivate: [AuthGuard]},
    ]},
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
