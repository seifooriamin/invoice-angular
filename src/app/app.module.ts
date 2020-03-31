import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopMenuComponent } from './top-menu/top-menu.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/tools/httperror.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomAdapter } from './shared/tools/dateformatmodal';
import { NgbDateCustomParserFormatter } from './shared/tools/dateformat';
import { SharedModule } from './shared/module/shared.module';
import {DashboardComponent} from './dashboard/dashboard.component';
import { ChartsModule, WavesModule, CardsModule } from 'angular-bootstrap-md';

@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    DashboardComponent
  ],
  imports: [
    ChartsModule,
    CardsModule,
    WavesModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  entryComponents: [

  ],
  providers: [
      {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpErrorInterceptor,
    multi: true
  },
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}],

  bootstrap: [AppComponent]
})
export class AppModule { }
