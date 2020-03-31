import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/module/shared.module';
import {InvoiceComponent} from './invoice.component';
import {InvoiceListComponent} from './invoice-list/invoice-list.component';
import {InvoiceAddViewModifyComponent} from './invoice-add-view-modify/invoice-add-view-modify.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {InvoiceRoutingModule} from './invoice-routing.module';

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoiceListComponent,
    InvoiceAddViewModifyComponent,
  ],
  imports: [
    SharedModule,
    InvoiceRoutingModule,
    NgbModule
  ]
})
export class InvoiceModule { }
