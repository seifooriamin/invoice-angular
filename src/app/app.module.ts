import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { SigninComponent } from './signin/signin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { VerifyComponent } from './verify/verify.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { CompanyComponent } from './company/company.component';
import { UsersComponent } from './users/users.component';
import { CompanyListComponent } from './company/company-list/company-list.component';
import { AddModifyComponent } from './company/add-modify/add-modify.component';
import { CustomerComponent } from './customer/customer.component';
import { AddModifyViewComponent } from './customer/add-modify-view/add-modify-view.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import {HttpErrorInterceptor} from './shared/tools/httperror.interceptor';




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
  ],
  imports: [
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    BrowserAnimationsModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [
    ConfirmModalComponent
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
