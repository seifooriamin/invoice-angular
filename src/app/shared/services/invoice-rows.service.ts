import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceRowsService {

  constructor(private httpClient: HttpClient) { }
  invoiceRowsDelete(invoiceID) {
    return this.httpClient.post('http://localhost/invoice-angular/api/invoice_rows/deletebyinvoiceid.php',
        invoiceID);
  }
}
