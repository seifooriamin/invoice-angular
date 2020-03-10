import { Injectable } from '@angular/core';
import {CountryModel} from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  country: CountryModel[] = [
    {countryName: 'Afghanistan', countryCode: 'AFG', flag: 'Afghanistan.png'},
    {countryName: 'Albania', countryCode: 'ALB', flag: 'Albania.png'}
  ];
  constructor() { }
  getCountry(): CountryModel[] {
    return this.country;
  }
}
