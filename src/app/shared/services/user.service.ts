import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getEmailExist(email) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/emailexist.php', email);
    return this.httpClient.post(`${environment.apiUrl}users/emailexist.php`, email);
  }
  userCreate(data) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/create.php', data);
    return this.httpClient.post(`${environment.apiUrl}users/create.php`, data);
  }
  userUpdate(data) {
    return this.httpClient.patch(`${environment.apiUrl}users/update.php`, data);
  }
  emailVerify(token) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/verify.php', token);
    return this.httpClient.post(`${environment.apiUrl}users/verify.php`, token);
  }
  // Checking whether JWT is valid or not
  tokenCheck(token) {
    // return this.httpClient.post('http://www.einvoicemaker.com/invoice/api/users/validate_token.php', token);
    return this.httpClient.post(`${environment.apiUrl}users/validate_token.php`, token);
  }
  // To be used for create new user General Setting file
  getLastUserID() {
    return this.httpClient.get(`${environment.apiUrl}users/getlastuserid.php`);
  }
  getUserByID(data) {
    return this.httpClient.post(`${environment.apiUrl}users/read_one`, data);
  }
  changePassword(data) {
    return this.httpClient.patch(`${environment.apiUrl}users/change_password`, data);
  }
  checkOldEmail(data) {
    return this.httpClient.post(`${environment.apiUrl}users/password_check`, data);
  }
  emailSender(data) {
    return this.httpClient.post(`${environment.apiUrl}libs/email_sender/mailsender`, data);
  }
}
