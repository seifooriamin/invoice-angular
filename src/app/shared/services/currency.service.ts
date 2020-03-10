import { Injectable } from '@angular/core';
import {CurrencyModel} from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  cur: CurrencyModel[] = [
    {currencyName: 'Australia Dollar', currencyCode: 'AUD', currencySymbol: '$', flag: 'Australia.png'},
    {currencyName: 'Canada Dollar', currencyCode: 'CAD', currencySymbol: '$', flag: 'Canada.png'},
    {currencyName: 'China Yuan Renminbi', currencyCode: 'CNY', currencySymbol: '¥', flag: 'China.png'},
    {currencyName: 'Euro Member Countries', currencyCode: 'EUR', currencySymbol: '€', flag: 'European Union.png'},
    {currencyName: 'India Rupee', currencyCode: 'INR', currencySymbol: '₹', flag: 'India.png'},
    {currencyName: 'Japan Yen', currencyCode: 'JPY', currencySymbol: '¥', flag: 'Japan.png'},
    {currencyName: 'Malaysia Ringgit', currencyCode: 'MYR', currencySymbol: 'RM', flag: 'Malaysia.png'},
    {currencyName: 'Singapore Dollar', currencyCode: 'SGD', currencySymbol: '$', flag: 'Singapore.png'},
    {currencyName: 'Switzerland Franc', currencyCode: 'CHF', currencySymbol: 'CHF', flag: 'Switzerland.png'},
    {currencyName: 'United States Dollar', currencyCode: 'USD', currencySymbol: '$', flag: 'USA.png'},
    {currencyName: 'United Kingdom Pound', currencyCode: 'GBP', currencySymbol: '£', flag: 'UK.png'}
  ];
  constructor() { }

  getCurrency(): CurrencyModel[] {
    return this.cur;
  }
}
