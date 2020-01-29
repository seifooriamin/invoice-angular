import { Injectable } from '@angular/core';
import {InvoiceService} from './invoice.service';
import {promise} from 'selenium-webdriver';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(private invoiceService: InvoiceService) { }

  imageAccept(imageType: string) {
    if ((imageType === 'image/gif') || (imageType === 'image/jpeg') || (imageType === 'image/png')) {
      return true;
    } else {
      return false;
    }
  }
  imageSize(imageSize) {
    if (imageSize <= 2097152) {
      return true;
    } else {
      return  false;
    }
  }
  showNumberWithDecimal(num): string {
    return ((num = Math.abs(Number(num) || 0).toFixed(2))).toString();
  }

  async getInvoiceNumber(): Promise<{invoiceDigit: string; invoicePrefix: string; }> {
     const q = new Promise<{invoiceDigit: string; invoicePrefix: string; }>((resolve) => {
     let digitPart = '';
     let newDigitPart = '';
     let prefix = '';
     let realDigit = 0;
     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
     const userId: string = '{ "user_id" : "' + currentUser['id'] + '" }';
     this.invoiceService.getInvoiceNumber(userId).subscribe(
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
