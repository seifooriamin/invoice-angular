import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyModel} from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }
  invoiceReadByUser(userId) {
    return this.httpClient.post<Array<CompanyModel>>
    ('http://localhost/invoice-angular/api/invoice/readbyuser.php', userId, {responseType: 'json'});
  }
  invoiceDelete(id) {
    return this.httpClient.post('http://localhost/invoice-angular/api/invoice/delete.php', id);
  }
}
