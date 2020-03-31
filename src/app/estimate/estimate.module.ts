import { NgModule } from '@angular/core';
import {SharedModule} from '../shared/module/shared.module';
import {EstimateComponent} from './estimate.component';
import {EstimateListComponent} from './estimate-list/estimate-list.component';
import {EstimateAddViewModifyComponent} from './estimate-add-view-modify/estimate-add-view-modify.component';
import {EstimateRoutingModule} from './estimate-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [
    EstimateComponent,
    EstimateListComponent,
    EstimateAddViewModifyComponent,
  ],
  imports: [
    SharedModule,
    EstimateRoutingModule,
    NgbModule
  ]
})
export class EstimateModule { }
