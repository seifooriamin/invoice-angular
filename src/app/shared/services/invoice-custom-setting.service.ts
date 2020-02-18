import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceCustomSettingService {

  constructor(private httpClient: HttpClient) { }

  createInvoiceCustomSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}invoice_custom_setting/create`, data);
  }
  deleteInvoiceCustomSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}invoice_custom_setting/delete`, data);
  }
  invoiceSettingByInvoiceID(id) {
    return this.httpClient.get(`${environment.apiUrl}invoice_custom_setting/readonebyinvoiceid.php?invoice_id=` + id,
        {responseType: 'json'});
  }
}
