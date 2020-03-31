import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {AddModifyViewComponent} from './add-modify-view/add-modify-view.component';


const routes: Routes = [
  {path: 'customer-list', component: CustomerListComponent},
  {path: 'new', component: AddModifyViewComponent},
  {path: ':id', component: AddModifyViewComponent},
  {path: ':id/modify', component: AddModifyViewComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
