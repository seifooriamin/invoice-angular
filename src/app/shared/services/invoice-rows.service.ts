import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRowsService {

  constructor(private httpClient: HttpClient) { }
  invoiceRowsDelete(invoiceID) {
    return this.httpClient.post(`${environment.apiUrl}invoice_rows/deletebyinvoiceid.php`,
        invoiceID);
  }
  getInvoiceRowsDescription(userID) {
    return this.httpClient.post(`${environment.apiUrl}invoice_rows/getdescription`, userID);
  }
  getInvoiceRowsComment(userID) {
    return this.httpClient.post(`${environment.apiUrl}invoice_rows/getcomment`, userID);
  }
  getInvoiceRowsUnitMeasure(userID) {
    return this.httpClient.post(`${environment.apiUrl}invoice_rows/getunitmeasure`, userID);
  }
  invoiceRowCreate(data) {
    return this.httpClient.post(`${environment.apiUrl}invoice_rows/create`, data);
  }
}
