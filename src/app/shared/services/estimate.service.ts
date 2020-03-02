import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {EstimateModel} from '../models/estimate.model';

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  constructor(private httpClient: HttpClient) { }
  estimateReadByUser(userId) {
    return this.httpClient.post<Array<EstimateModel>>
    (`${environment.apiUrl}estimate/readbyuser`, userId, {responseType: 'json'});
  }
  estimateDelete(id) {
    return this.httpClient.post(`${environment.apiUrl}estimate/delete`, id);
  }
  getEstimateNumber(id) {
    return this.httpClient.post(`${environment.apiUrl}estimate/getestimatenumber`, id);
  }
  estimateCreate(data) {
    return this.httpClient.post(`${environment.apiUrl}estimate/create`, data);
  }
  estimateByID(id) {
    return this.httpClient.get<EstimateModel>(`${environment.apiUrl}estimate/read_one.php?id=` + id,
        {responseType: 'json'});
  }
  estimateUpdate(data) {
    return this.httpClient.patch(`${environment.apiUrl}estimate/update`, data);
  }
  async setNewEstimateNumber(): Promise<{estimateDigit: string; estimatePrefix: string; }> {
    const q = new Promise<{estimateDigit: string; estimatePrefix: string; }>((resolve) => {
      let digitPart = '';
      let newDigitPart = '';
      let prefix = '';
      let realDigit = 0;
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      const userId: string = '{ "user_id" : "' + currentUser['id'] + '" }';
      this.getEstimateNumber(userId).subscribe(
          (response) => {
            const lastEstimateNumber = response['estimate_number'];
            let separator = 0;
            const estimateNumberLength = lastEstimateNumber.length;
            const lengthMines = estimateNumberLength - 1;
            for (let counter = lengthMines; counter >= 0; counter--) {
              if (!(+lastEstimateNumber.substr(counter, 1) >= 0) &&
                  !(+lastEstimateNumber.substr(counter, 1) <= 9)) {
                separator = ++counter;
                break;
              }
            }
            const digitPartLength = estimateNumberLength - separator;
            digitPart = lastEstimateNumber.substr(separator, digitPartLength);
            realDigit = +digitPart;
            const previousRealDigit = realDigit;
            ++realDigit;
            if ((realDigit.toString().length - previousRealDigit.toString().length) > 0) {
              const reducer = separator + 1;
              digitPart = lastEstimateNumber.substr(reducer, digitPartLength);
            }
            for (let counter = 0; counter < digitPart.length; counter++) {
              if ((digitPart.substr(counter, 1)) === '0') {
                newDigitPart += digitPart.substr(counter, 1);
              } else {
                break;
              }
            }
            newDigitPart += realDigit;
            prefix = lastEstimateNumber.substr(0, separator);
            resolve({estimateDigit: newDigitPart, estimatePrefix: prefix});
          }, (e) => {
            newDigitPart = '001';
            resolve({estimateDigit: newDigitPart, estimatePrefix: prefix});
          }
      );
    });
    return q;
  }
}
