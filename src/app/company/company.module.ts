import { NgModule } from '@angular/core';
import {CompanyListComponent} from './company-list/company-list.component';
import {AddModifyComponent} from './add-modify/add-modify.component';
import {CompanyComponent} from './company.component';
import {SharedModule} from '../shared/module/shared.module';

import {CompanyRoutingModule} from './company-routing.module';


@NgModule({
  declarations: [
    CompanyListComponent,
    AddModifyComponent,
    CompanyComponent
  ],
  imports: [
    SharedModule,
    CompanyRoutingModule,
  ],
  exports: [

  ]
})
export class CompanyModule { }
