import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/module/shared.module';
import {CustomerComponent} from './customer.component';
import {AddModifyViewComponent} from './add-modify-view/add-modify-view.component';
import {CustomerListComponent} from './customer-list/customer-list.component';
import {CustomerRoutingModule} from './customer-routing.module';



@NgModule({
  declarations: [
    CustomerComponent,
    AddModifyViewComponent,
    CustomerListComponent,
  ],
  imports: [
    SharedModule,
    CustomerRoutingModule,
  ]
})
export class CustomerModule { }
