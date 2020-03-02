import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimateRowsService {

  constructor(private httpClient: HttpClient) { }
  estimateRowsDelete(invoiceID) {
    return this.httpClient.post(`${environment.apiUrl}estimate_rows/deletebyestimateid.php`,
        invoiceID);
  }
  getEstimateRowsDescription(userID) {
    return this.httpClient.post(`${environment.apiUrl}estimate_rows/getdescription`, userID);
  }
  getEstimateRowsComment(userID) {
    return this.httpClient.post(`${environment.apiUrl}estimate_rows/getcomment`, userID);
  }
  getEstimateRowsUnitMeasure(userID) {
    return this.httpClient.post(`${environment.apiUrl}estimate_rows/getunitmeasure`, userID);
  }
  estimateRowCreate(data) {
    return this.httpClient.post(`${environment.apiUrl}estimate_rows/create`, data);
  }
  estimateRowsByEstimateID(id) {
    return this.httpClient.get(`${environment.apiUrl}estimate_rows/read_per_estimate.php?estimate_id=` + id,
        {responseType: 'json'});
  }
}
