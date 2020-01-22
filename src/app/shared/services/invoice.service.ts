import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyModel} from '../models/company.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }
  invoiceReadByUser(userId) {
    return this.httpClient.post<Array<CompanyModel>>
    (`${environment.apiUrl}invoice/readbyuser`, userId, {responseType: 'json'});
  }
  invoiceDelete(id) {
    return this.httpClient.post(`${environment.apiUrl}invoice/delete`, id);
  }
}
