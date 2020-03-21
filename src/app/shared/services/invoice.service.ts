import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {InvoiceModel} from '../models/invoice.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }
  invoiceReadByUser(userId) {
    return this.httpClient.post<Array<InvoiceModel>>
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
  invoiceByID(id) {
    return this.httpClient.get<InvoiceModel>(`${environment.apiUrl}invoice/read_one.php?id=` + id,
      {responseType: 'json'});
  }
  invoiceUpdate(data) {
      return this.httpClient.patch(`${environment.apiUrl}invoice/update`, data);
  }
  invoiceYear(data) {
      return this.httpClient.patch(`${environment.apiUrl}invoice/getyear`, data);
  }
  invoiceStatistics(data) {
      return this.httpClient.post(`${environment.apiUrl}invoice/invoice_statistics`, data);
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
            const lengthMines = invoiceNumberLength - 1;
            for (let counter = lengthMines; counter >= 0; counter--) {
              if (!(+lastInvoiceNumber.substr(counter, 1) >= 0) &&
                  !(+lastInvoiceNumber.substr(counter, 1) <= 9)) {
                  separator = ++counter;
                  break;
              }
            }
            const digitPartLength = invoiceNumberLength - separator;
            digitPart = lastInvoiceNumber.substr(separator, digitPartLength);
            realDigit = +digitPart;
            const previousRealDigit = realDigit;
            ++realDigit;
            if ((realDigit.toString().length - previousRealDigit.toString().length) > 0) {
                const reducer = separator + 1;
                digitPart = lastInvoiceNumber.substr(reducer, digitPartLength);
            }
            for (let counter = 0; counter < digitPart.length; counter++) {
              if ((digitPart.substr(counter, 1)) === '0') {
                newDigitPart += digitPart.substr(counter, 1);
              } else {
                  break;
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
