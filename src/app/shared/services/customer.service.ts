import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CustomerModel} from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  customerReadByUser(userId) {
    return this.httpClient.post<Array<CustomerModel>>
    ('http://localhost/invoice-angular/api/customers/readbyuser.php', userId, {responseType: 'json'});
  }
}
