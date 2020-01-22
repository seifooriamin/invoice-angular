import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyModel} from '../models/company.model';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  companyCreate(file: File, data: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file != null) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.post(`${environment.apiUrl}companies/create`, formData);
  }
  companyReadByUser(userId) {
    return this.httpClient.post<Array<CompanyModel>>
    (`${environment.apiUrl}companies/readbyuser`, userId, {responseType: 'json'});
  }
  companyDelete(id) {
    return this.httpClient.post(`${environment.apiUrl}companies/delete.php`, id);
  }
  companyByID(id) {
    return this.httpClient.get<CompanyModel>(`${environment.apiUrl}companies/read_one.php?id=` + id,
        {responseType: 'json'});
  }
  companyUpdate(file: File, data: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file != null) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post(`${environment.apiUrl}companies/update.php`, formData);
  }


}
