import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CompanyListComponent} from './company-list/company-list.component';
import {AddModifyComponent} from './add-modify/add-modify.component';

const routes: Routes = [
      {path: 'company-list', component: CompanyListComponent},
      {path: 'new', component: AddModifyComponent},
      {path: ':id', component: AddModifyComponent},
      {path: ':id/modify', component: AddModifyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
