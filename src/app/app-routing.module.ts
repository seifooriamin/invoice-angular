import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './shared/tools/auth.guard';
import {DashboardComponent} from './dashboard/dashboard.component';




const routes: Routes = [
    {path: '', redirectTo: 'users/login', pathMatch: 'full', canActivate: [AuthGuard]},
    {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
    {path: 'company', loadChildren: './company/company.module#CompanyModule', canActivate: [AuthGuard]},
    {path: 'customer', loadChildren: './customer/customer.module#CustomerModule', canActivate: [AuthGuard]},
    {path: 'estimate', loadChildren: './estimate/estimate.module#EstimateModule', canActivate: [AuthGuard]},
    {path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule', canActivate: [AuthGuard]},
    {path: 'users', loadChildren: './users/users.module#UsersModule'},
    {path: '**', redirectTo: 'dashboard', pathMatch: 'full', canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
