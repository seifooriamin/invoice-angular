import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {EstimateListComponent} from './estimate-list/estimate-list.component';
import {EstimateAddViewModifyComponent} from './estimate-add-view-modify/estimate-add-view-modify.component';

const routes: Routes = [
  {path: 'estimate-list', component: EstimateListComponent},
  {path: 'new', component: EstimateAddViewModifyComponent},
  {path: ':id', component: EstimateAddViewModifyComponent},
  {path: ':id/modify', component: EstimateAddViewModifyComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstimateRoutingModule { }
