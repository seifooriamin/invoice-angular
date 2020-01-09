import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

}
