import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getEmailExist(email) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/emailexist.php', email);
    return this.httpClient.post('http://localhost/invoice-angular/api/users/emailexist.php', email);
  }

  userCreate(data) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/create.php', data);
    return this.httpClient.post('http://localhost/invoice-angular/api/users/create.php', data);
  }

  emailVerify(token) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/verify.php', token);
    return this.httpClient.post('http://localhost/invoice-angular/api/users/verify.php', token);
  }

  tokenCheck(token) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/validate_token.php', token);
    return this.httpClient.post('http://localhost/invoice-angular/api/users/validate_token.php', token);
  }
}
