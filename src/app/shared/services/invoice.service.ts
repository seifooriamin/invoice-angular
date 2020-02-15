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
  getInvoiceNumber(id) {
    return this.httpClient.post(`${environment.apiUrl}invoice/getinvoicenumber`, id);
  }
  invoiceCreate(data) {
    return this.httpClient.post(`${environment.apiUrl}invoice/create`, data);
  }
  async setNewInvoiceNumber(): Promise<{invoiceDigit: string; invoicePrefix: string; }> {
    const q = new Promise<{invoiceDigit: string; invoicePrefix: string; }>((resolve) => {
      let digitPart = '';
      let newDigitPart = '';
      let prefix = '';
      let realDigit = 0;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      const userId: string = '{ "user_id" : "' + currentUser['id'] + '" }';
      this.getInvoiceNumber(userId).subscribe(
          (response) => {
            const lastInvoiceNumber = response['invoice_number'];
            let separator = 0;
            const invoiceNumberLength = lastInvoiceNumber.length;
            for (let counter = invoiceNumberLength; counter >= 0; counter--) {
              if (!(+lastInvoiceNumber.substr(counter, 1) >= 0) &&
                  !(+lastInvoiceNumber.substr(counter, 1) <= 9)) {
                separator = ++counter;
                break;
              }
            }
            const digitPartLength = invoiceNumberLength - separator;
            digitPart = lastInvoiceNumber.substr(separator, digitPartLength);
            realDigit = +digitPart;
            ++realDigit;
            for (let counter = 0; counter < digitPart.length; counter++) {
              if ((digitPart.substr(counter, 1)) === '0') {
                newDigitPart += digitPart.substr(counter, 1);
              }
            }
            newDigitPart += realDigit;
            prefix = lastInvoiceNumber.substr(0, separator);
            resolve({invoiceDigit: newDigitPart, invoicePrefix: prefix});
          }, (e) => {
            newDigitPart = '001';
            resolve({invoiceDigit: newDigitPart, invoicePrefix: prefix});
          }
      );
    });
    return q;
  }
}
