import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { SigninComponent } from './users/signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SignupComponent } from './users/signup/signup.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttpErrorInterceptor} from './shared/tools/httperror.interceptor';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { VerifyComponent } from './users/verify/verify.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TableModule, ChartsModule, WavesModule, CardsModule } from 'angular-bootstrap-md';
import { CompanyComponent } from './company/company.component';
import { UsersComponent } from './users/users.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AddModifyComponent } from './company/add-modify/add-modify.component';
import { CustomerComponent } from './customer/customer.component';
import { AddModifyViewComponent } from './customer/add-modify-view/add-modify-view.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceListComponent } from './invoice/invoice-list/invoice-list.component';
import { InvoiceAddViewModifyComponent } from './invoice/invoice-add-view-modify/invoice-add-view-modify.component';
import {CustomAdapter} from './shared/tools/dateformatmodal';
import {NgbDateCustomParserFormatter} from './shared/tools/dateformat';
import {LoadingBarHttpClientModule} from '@ngx-loading-bar/http-client';
import {LoadingBarRouterModule} from '@ngx-loading-bar/router';
import {LoadingBarModule} from '@ngx-loading-bar/core';
import { EstimateComponent } from './estimate/estimate.component';
import { EstimateListComponent } from './estimate/estimate-list/estimate-list.component';
import { EstimateAddViewModifyComponent } from './estimate/estimate-add-view-modify/estimate-add-view-modify.component';
import { ProfileComponent } from './users/profile/profile.component';
import { GeneralSettingComponent } from './users/general-setting/general-setting.component';
import { ResetPasswordRequestComponent } from './users/reset-password-request/reset-password-request.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    SigninComponent,
    DashboardComponent,
    SignupComponent,
    ConfirmModalComponent,
    VerifyComponent,
    CompanyComponent,
    UsersComponent,
    CompanyListComponent,
    AddModifyComponent,
    CustomerComponent,
    AddModifyViewComponent,
    CustomerListComponent,
    InvoiceComponent,
    InvoiceListComponent,
    InvoiceAddViewModifyComponent,
    EstimateComponent,
    EstimateListComponent,
    EstimateAddViewModifyComponent,
    ProfileComponent,
    GeneralSettingComponent,
    ResetPasswordRequestComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CardsModule,
    TableModule,
    ChartsModule,
    WavesModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [
    ConfirmModalComponent
  ],
  providers: [
  //     {
  //   provide: HTTP_INTERCEPTORS,
  //   useClass: HttpErrorInterceptor,
  //   multi: true
  // },
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],

  bootstrap: [AppComponent]
})
export class AppModule { }
