import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private httpClient: HttpClient) { }

  uploader(data) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/create.php', data);
    return this.httpClient.post('http://localhost/invoice-angular/api/companies/uploader.php', data);

  }

}
