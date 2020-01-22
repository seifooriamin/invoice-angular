import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CustomerModel} from '../models/customer.model';
import {CompanyModel} from '../models/company.model';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  customerReadByUser(userId) {
    return this.httpClient.post<Array<CustomerModel>>
    (`${environment.apiUrl}customers/readbyuser`, userId, {responseType: 'json'});
  }
  customerDelete(id) {
    return this.httpClient.post(`${environment.apiUrl}customers/delete`, id);
  }
  customerByID(id) {
    return this.httpClient.get<CompanyModel>(`${environment.apiUrl}customers/read_one.php?id=` + id,
        {responseType: 'json'});
  }
  customerCreate(data: any) {
    return this.httpClient.post(`${environment.apiUrl}customers/create`, data);
  }
  customerUpdate(data: any) {
    return this.httpClient.patch(`${environment.apiUrl}customers/update`, data);
  }
}
