import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstimateCustomSettingService {

  constructor(private httpClient: HttpClient) { }
  createEstimateCustomSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}estimate_custom_setting/create`, data);
  }
  deleteEstimateCustomSetting(data: any) {
    return this.httpClient.post(`${environment.apiUrl}estimate_custom_setting/delete`, data);
  }
  estimateSettingByEstimateID(id) {
    return this.httpClient.get(`${environment.apiUrl}estimate_custom_setting/readonebyestimateid.php?estimate_id=` + id,
        {responseType: 'json'});
  }
  updateEstimateCustomSetting(data: any) {
    return this.httpClient.patch(`${environment.apiUrl}estimate_custom_setting/update`, data);
  }
}
