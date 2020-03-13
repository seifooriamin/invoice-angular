import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceGeneralSettingService {

  constructor(private httpClient: HttpClient) { }

  createInvoiceSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}invoice_general_setting/create`, data);
  }
  readInvoiceSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}invoice_general_setting/readonebyuserid`, data,
        {responseType: 'json'});
  }
  updateInvoiceSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}invoice_general_setting/update`, data);
  }
}
