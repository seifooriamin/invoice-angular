import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CompanyModel} from '../models/company.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  fileanddata(file: File, data: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file != null) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post('http://localhost/invoice-angular/api/companies/uploader.php', formData);
  }

  companyCreate(file: File, data: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file != null) {
      formData.append('file', file, file.name);
    }
    return this.httpClient.post('http://localhost/invoice-angular/api/companies/create.php', formData);
  }
  companyRead() {
    return this.httpClient.get<Array<CompanyModel>>('http://localhost/invoice-angular/api/companies/read.php', {responseType: 'json'});
  }
  companyPage(url) {
    return this.httpClient.get(url);
  }
  companyReadByUser(userId) {
    return this.httpClient.post<Array<CompanyModel>>
    ('http://localhost/invoice-angular/api/companies/readbyuser.php', userId, {responseType: 'json'});
  }
  companyDelete(id) {
    return this.httpClient.post('http://localhost/invoice-angular/api/companies/delete.php', id);
  }
  companyByID(id) {
    return this.httpClient.get<CompanyModel>('http://localhost/invoice-angular/api/companies/read_one.php?id=' + id,
        {responseType: 'json'});
  }
  companyUpdate(file: File, data: any) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file != null) {
      formData.append('file', file, file.name);
    }

    return this.httpClient.post('http://localhost/invoice-angular/api/companies/update.php', formData);
  }


}
