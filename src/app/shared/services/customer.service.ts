import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CustomerModel} from '../models/customer.model';
import {CompanyModel} from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  customerReadByUser(userId) {
    return this.httpClient.post<Array<CustomerModel>>
    ('http://localhost/invoice-angular/api/customers/readbyuser.php', userId, {responseType: 'json'});
  }
  customerDelete(id) {
    return this.httpClient.post('http://localhost/invoice-angular/api/customers/delete.php', id);
  }
  customerByID(id) {
    return this.httpClient.get<CompanyModel>('http://localhost/invoice-angular/api/customers/read_one.php?id=' + id,
        {responseType: 'json'});
  }
  customerCreate(data: any) {
    return this.httpClient.post('http://localhost/invoice-angular/api/customers/create.php', data);
  }
  customerUpdate(data: any) {
    return this.httpClient.patch('http://localhost/invoice-angular/api/customers/update.php', data);
  }
}
