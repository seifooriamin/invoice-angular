import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {InvoiceListComponent} from './invoice-list/invoice-list.component';
import {InvoiceAddViewModifyComponent} from './invoice-add-view-modify/invoice-add-view-modify.component';

const routes: Routes = [
  {path: 'invoice-list', component: InvoiceListComponent},
  {path: 'new', component: InvoiceAddViewModifyComponent},
  {path: ':id', component: InvoiceAddViewModifyComponent},
  {path: ':id/modify', component: InvoiceAddViewModifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule { }
