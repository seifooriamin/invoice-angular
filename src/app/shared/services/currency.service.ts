import { Injectable } from '@angular/core';
import {CurrencyModel} from '../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  cur: CurrencyModel[] = [
    {currencyName: 'Albania Lek', currencyCode: 'ALL', currencySymbol: 'Lek', flag: 'Albania.png'},
    {currencyName: 'Afghanistan Afghani', currencyCode: 'AFN', currencySymbol: '؋', flag: 'Afghanistan.png'},
    {currencyName: 'Argentina Peso', currencyCode: 'ARS', currencySymbol: '$', flag: 'Argentina.png'},
    {currencyName: 'Aruba Guilder', currencyCode: 'AWG', currencySymbol: 'ƒ', flag: 'Aruba.png'},
    {currencyName: 'Australia Dollar', currencyCode: 'AUD', currencySymbol: '$', flag: 'Australia.png'},
    {currencyName: 'Azerbaijan Manat', currencyCode: 'AZN', currencySymbol: '₼', flag: 'Azerbaijan.png'},
    {currencyName: 'Bahamas Dollar', currencyCode: 'BSD', currencySymbol: '$', flag: 'Bahamas.png'},
    {currencyName: 'Barbados Dollar', currencyCode: 'BBD', currencySymbol: '$', flag: 'Barbados.png'},
    {currencyName: 'Belarus Ruble', currencyCode: 'BYN', currencySymbol: 'Br', flag: 'Belarus.png'},
    {currencyName: 'Belize Dollar', currencyCode: 'BZD', currencySymbol: 'BZ$', flag: 'Belize.png'},
    {currencyName: 'Bolivia Bolíviano', currencyCode: 'BOB', currencySymbol: '$b', flag: 'Bolivia.png'},
    {currencyName: 'Bosnia and Herzegovina Convertible Mark', currencyCode: 'BAM', currencySymbol: 'KM', flag: 'BosniaHerzegovina.png'},
    {currencyName: 'Botswana Pula', currencyCode: 'BWP', currencySymbol: 'P', flag: 'Botswana.png'},
    {currencyName: 'Bulgaria Lev', currencyCode: 'BGN', currencySymbol: 'лв', flag: 'Bulgaria.png'},
    {currencyName: 'Brazil Real', currencyCode: 'BRL', currencySymbol: 'R$', flag: 'Brazil.png'},
    {currencyName: 'Brunei Darussalam Dollar', currencyCode: 'BND', currencySymbol: '$', flag: 'Brunei.png'},
    {currencyName: 'Cambodia Riel', currencyCode: 'KHR', currencySymbol: '៛', flag: 'Cambodja.png'},
    {currencyName: 'Canada Dollar', currencyCode: 'CAD', currencySymbol: '$', flag: 'Canada.png'},
    {currencyName: 'Cayman Islands Dollar', currencyCode: 'KYD', currencySymbol: '$', flag: 'CaymanIslands.png'},
    {currencyName: 'Chile Peso', currencyCode: 'CLP', currencySymbol: '$', flag: 'Chile.png'},
    {currencyName: 'China Yuan Renminbi', currencyCode: 'CNY', currencySymbol: '¥', flag: 'China.png'},
    {currencyName: 'Colombia Peso', currencyCode: 'COP', currencySymbol: '$', flag: 'Colombia.png'},
    {currencyName: 'Costa Rica Colon', currencyCode: 'CRC', currencySymbol: '₡', flag: 'CostaRica.png'},
    {currencyName: 'Croatia Kuna', currencyCode: 'HRK', currencySymbol: 'kn', flag: 'Croatia.png'},
    {currencyName: 'Cuba Peso', currencyCode: 'CUP', currencySymbol: '₱', flag: 'Cuba.png'},
    {currencyName: 'Czech Republic Koruna', currencyCode: 'CZK', currencySymbol: 'Kč', flag: 'CzechRepublic.png'},
    {currencyName: 'Denmark Krone', currencyCode: 'DKK', currencySymbol: 'kr', flag: 'Denmark.png'},
    {currencyName: 'Dominican Republic Peso', currencyCode: 'DOP', currencySymbol: 'RD$', flag: 'Dominica.png'},
    {currencyName: 'East Caribbean Dollar', currencyCode: 'XCD', currencySymbol: '$', flag: 'ecd.png'},
    {currencyName: 'Egypt Pound', currencyCode: 'EGP', currencySymbol: '£', flag: 'Egypt.png'},
    {currencyName: 'El Salvador Colon', currencyCode: 'SVC', currencySymbol: '$', flag: 'ElSalvador.png'},
    {currencyName: 'Euro Member Countrie', currencyCode: 'EUR', currencySymbol: '€', flag: 'European Union.png'},
    {currencyName: 'Falkland Islands (Malvinas) Pound', currencyCode: 'FKP', currencySymbol: '£', flag: 'Falklandislands.png'},
    {currencyName: 'Fiji Dollar', currencyCode: 'FJD', currencySymbol: '$', flag: 'Fiji.png'},
    {currencyName: 'Ghana Cedi', currencyCode: 'GHS', currencySymbol: '¢', flag: 'Ghana.png'},
    {currencyName: 'Gibraltar Pound', currencyCode: 'GIP', currencySymbol: '£', flag: 'Gibraltar.png'},
    {currencyName: 'Guatemala Quetzal', currencyCode: 'GTQ', currencySymbol: 'Q', flag: 'Guatemala.png'},
    {currencyName: 'Guernsey Pound', currencyCode: 'GGP', currencySymbol: '£', flag: 'Guernsey.png'},
    {currencyName: 'Guyana Dollar', currencyCode: 'GYD', currencySymbol: '$', flag: 'Guyana.png'},
    {currencyName: 'Honduras Lempira', currencyCode: 'HNL', currencySymbol: 'L', flag: 'Honduras.png'},
    {currencyName: 'Hong Kong Dollar', currencyCode: 'HKD', currencySymbol: '$', flag: 'HongKong.png'},
    {currencyName: 'Hungary Forint', currencyCode: 'HUF', currencySymbol: 'Ft', flag: 'Hungary.png'},
    {currencyName: 'Iceland Krona', currencyCode: 'ISK', currencySymbol: 'kr', flag: 'Iceland.png'},
    {currencyName: 'India Rupee', currencyCode: 'INR', currencySymbol: '₹', flag: 'India.png'},
    {currencyName: 'Indonesia Rupiah', currencyCode: 'IDR', currencySymbol: 'Rp', flag: 'Indonezia.png'},
    {currencyName: 'Iran Rial', currencyCode: 'IRR', currencySymbol: '﷼', flag: 'Iran.png'},
    {currencyName: 'Isle of Man Pound', currencyCode: 'IMP', currencySymbol: '£', flag: 'IsleofMan.png'},
    {currencyName: 'Israel Shekel', currencyCode: 'ILS', currencySymbol: '₪', flag: 'Israel.png'},
    {currencyName: 'Jamaica Dollar', currencyCode: 'JMD', currencySymbol: 'J$', flag: 'Jamaica.png'},
    {currencyName: 'Japan Yen', currencyCode: 'JPY', currencySymbol: '¥', flag: 'Japan.png'},
    {currencyName: 'Jersey Pound', currencyCode: 'JEP', currencySymbol: '£', flag: 'Jersey.png'},
    {currencyName: 'Kazakhstan Tenge', currencyCode: 'KZT', currencySymbol: 'лв', flag: 'Kazakhstan.png'},
    {currencyName: 'Kyrgyzstan Som', currencyCode: 'KGS', currencySymbol: 'лв', flag: 'Kyrgyzstan.png'},
    {currencyName: 'Laos Kip', currencyCode: 'LAK', currencySymbol: '₭', flag: 'Laos.png'},
    {currencyName: 'Lebanon Pound', currencyCode: 'LBP', currencySymbol: '£', flag: 'Lebanon.png'},
    {currencyName: 'Liberia Dollar', currencyCode: 'LRD', currencySymbol: '$', flag: 'Liberia.png'},
    {currencyName: 'Macedonia Denar', currencyCode: 'MKD', currencySymbol: 'ден', flag: 'Macedonia.png'},
    {currencyName: 'Malaysia Ringgit', currencyCode: 'MYR', currencySymbol: 'RM', flag: 'Malaysia.png'},
    {currencyName: 'Mauritius Rupee', currencyCode: 'MUR', currencySymbol: '₨', flag: 'Mauritius.png'},
    {currencyName: 'Mexico Peso', currencyCode: 'MXN', currencySymbol: '$', flag: 'Mexico.png'},
    {currencyName: 'Mongolia Tughrik', currencyCode: 'MNT', currencySymbol: '₮', flag: 'Mongolia.png'},
    {currencyName: 'Mozambique Metical', currencyCode: 'MZN', currencySymbol: 'MT', flag: 'Mozambique.png'},
    {currencyName: 'Namibia Dollar', currencyCode: 'NAD', currencySymbol: '$', flag: 'Namibia.png'},
    {currencyName: 'Nepal Rupee', currencyCode: 'NPR', currencySymbol: '₨', flag: 'Nepal.png'},
    {currencyName: 'Netherlands Antilles Guilder', currencyCode: 'ANG', currencySymbol: 'ƒ', flag: 'NetherlandsAntilles.png'},
    {currencyName: 'New Zealand Dollar', currencyCode: 'NZD', currencySymbol: '$', flag: 'NewZealand.png'},
    {currencyName: 'Nicaragua Cordoba', currencyCode: 'NIO', currencySymbol: 'C$', flag: 'Nicaragua.png'},
    {currencyName: 'Nigeria Naira', currencyCode: 'NGN', currencySymbol: '₦', flag: 'Nigeria.png'},
    {currencyName: 'North Korea  Won', currencyCode: 'KPW', currencySymbol: '₩', flag: 'NorthKorea.png'},
    {currencyName: 'Norway Krone', currencyCode: 'NOK', currencySymbol: 'kr', flag: 'Norway.png'},
    {currencyName: 'Oman Rial', currencyCode: 'OMR', currencySymbol: '﷼', flag: 'Oman.png'},
    {currencyName: 'Pakistan Rupee', currencyCode: 'PKR', currencySymbol: '₨', flag: 'Pakistan.png'},
    {currencyName: 'Panama Balboa', currencyCode: 'PAB', currencySymbol: 'B/.', flag: 'Panama.png'},
    {currencyName: 'Paraguay Guarani', currencyCode: 'PYG', currencySymbol: 'Gs', flag: 'Paraguay.png'},
    {currencyName: 'Peru Sol', currencyCode: 'PEN', currencySymbol: 'S/.', flag: 'Peru.png'},
    {currencyName: 'Philippines Peso', currencyCode: 'PHP', currencySymbol: '₱', flag: 'Philippines.png'},
    {currencyName: 'Poland Zloty', currencyCode: 'PLN', currencySymbol: 'zł', flag: 'Poland.png'},
    {currencyName: 'Qatar Riyal', currencyCode: 'QAR', currencySymbol: '﷼', flag: 'Qatar.png'},
    {currencyName: 'Romania Leu', currencyCode: 'RON', currencySymbol: 'lei', flag: 'Romania.png'},
    {currencyName: 'Russia Ruble', currencyCode: 'RUB', currencySymbol: '₽', flag: 'RussianFederation.png'},
    {currencyName: 'Saint Helena Pound', currencyCode: 'SHP', currencySymbol: '£', flag: 'Sainthelena.png'},
    {currencyName: 'Saudi Arabia Riyal', currencyCode: 'SAR', currencySymbol: '﷼', flag: 'SaudiArabia.png'},
    {currencyName: 'Serbia Dinar', currencyCode: 'RSD', currencySymbol: 'Дин.', flag: 'SerbiaYugoslavia.png'},
    {currencyName: 'Seychelles Rupee', currencyCode: 'SCR', currencySymbol: '₨', flag: 'Seychelles.png'},
    {currencyName: 'Singapore Dollar', currencyCode: 'SGD', currencySymbol: '$', flag: 'Singapore.png'},
    {currencyName: 'Solomon Islands Dollar', currencyCode: 'SBD', currencySymbol: '$', flag: 'SolomonIslands.png'},
    {currencyName: 'Somalia Shilling', currencyCode: 'SOS', currencySymbol: 'S', flag: 'Somalia.png'},
    {currencyName: 'South Africa Rand', currencyCode: 'ZAR', currencySymbol: 'R', flag: 'SouthAfrica.png'},
    {currencyName: 'South Korea Won', currencyCode: 'KRW', currencySymbol: '₩', flag: 'SouthKorea.png'},
    {currencyName: 'Sri Lanka Rupee', currencyCode: 'LKR', currencySymbol: '₨', flag: 'SriLanka.png'},
    {currencyName: 'Sweden Krona', currencyCode: 'SEK', currencySymbol: 'kr', flag: 'Sweden.png'},
    {currencyName: 'Switzerland Franc', currencyCode: 'CHF', currencySymbol: 'CHF', flag: 'Swaziland.png'},
    {currencyName: 'Suriname Dollar', currencyCode: 'SRD', currencySymbol: '$', flag: 'Suriname.png'},
    {currencyName: 'Syria Pound', currencyCode: 'SYP', currencySymbol: '£', flag: 'Syria.png'},
    {currencyName: 'Taiwan New Dollar', currencyCode: 'TWD', currencySymbol: 'NT$', flag: 'Taiwan.png'},
    {currencyName: 'Thailand Baht', currencyCode: 'THB', currencySymbol: '฿', flag: 'Thailand.png'},
    {currencyName: 'Trinidad and Tobago Dollar', currencyCode: 'TTD', currencySymbol: 'TT$', flag: 'Trinidad&Tobago.png'},
    {currencyName: 'Turkey Lira', currencyCode: 'TRY', currencySymbol: '₺', flag: 'Turkey.png'},
    {currencyName: 'Tuvalu Dollar', currencyCode: 'TVD', currencySymbol: '$', flag: 'Tuvalu.png'},
    {currencyName: 'Ukraine Hryvnia', currencyCode: 'UAH', currencySymbol: '₴', flag: 'Ukraine.png'},
    {currencyName: 'United Kingdom Pound', currencyCode: 'GBP', currencySymbol: '£', flag: 'UK.png'},
    {currencyName: 'United States Dollar', currencyCode: 'USD', currencySymbol: '$', flag: 'USA.png'},
    {currencyName: 'Uruguay Peso', currencyCode: 'UYU', currencySymbol: '$U	', flag: 'Uruguay.png'},
    {currencyName: 'Uzbekistan Som', currencyCode: 'UZS', currencySymbol: 'лв', flag: 'Uzbekistan.png'},
    {currencyName: 'Viet Nam Dong', currencyCode: 'VND', currencySymbol: '₫', flag: 'VietNam.png'},
    {currencyName: 'Yemen Rial', currencyCode: 'YER', currencySymbol: '﷼', flag: 'Yemen.png'},
    {currencyName: 'Zimbabwe Dollar', currencyCode: 'ZWD', currencySymbol: 'Z$', flag: 'Zimbabwe.png'},
    {currencyName: 'Bahraini dinar', currencyCode: 'BHD', currencySymbol: '.د.ب', flag: 'Bahrain.png'},
    {currencyName: 'Angolan kwanza', currencyCode: 'AOA', currencySymbol: 'Kz', flag: 'Angola.png'},
    {currencyName: 'Algerian dinar', currencyCode: 'DZD', currencySymbol: 'د.ج', flag: 'Algeria.png'},
    {currencyName: 'Armenian dram', currencyCode: 'AMD', currencySymbol: '֏', flag: 'Armenia.png'},
    {currencyName: 'Bangladeshi taka', currencyCode: 'BDT', currencySymbol: '৳', flag: 'Bangladesh.png'},
    {currencyName: 'West African CFA franc', currencyCode: 'XOF', currencySymbol: 'Fr', flag: 'Benin.png'},
    {currencyName: 'Bermudian dollar', currencyCode: 'BMD', currencySymbol: '$', flag: 'Bermuda.png'},
    {currencyName: 'Bhutanese ngultrum', currencyCode: 'BTN', currencySymbol: 'Nu.', flag: 'Bhutan.png'},
    {currencyName: 'Burundi franc', currencyCode: 'BIF', currencySymbol: 'Fr', flag: 'Burundi.png'},
    {currencyName: 'Cape Verdean escudo', currencyCode: 'CVE', currencySymbol: 'Esc', flag: 'Cape Verde.png'},
    {currencyName: 'Central African CFA franc', currencyCode: 'XAF', currencySymbol: 'Fr', flag: 'CentralAfricanRepublic.png'},
    {currencyName: 'Comorian franc', currencyCode: 'KMF', currencySymbol: 'Fr', flag: 'Comoros.png'},
    {currencyName: 'Congolese franc', currencyCode: 'CDF', currencySymbol: 'Fr', flag: 'Congo-Kinshasa(Zaire).png'},
    {currencyName: 'Djiboutian franc', currencyCode: 'DJF', currencySymbol: 'Fr', flag: 'Djibouti.png'},
    {currencyName: 'Eritrean nakfa', currencyCode: 'ERN', currencySymbol: 'Nfk', flag: 'Eritrea.png'},
    {currencyName: 'Swazi lilangeni', currencyCode: 'SZL', currencySymbol: 'L', flag: 'Eswatini.png'},
    {currencyName: 'Ethiopian birr', currencyCode: 'ETB', currencySymbol: 'Br', flag: 'Ethiopia.png'},
    {currencyName: 'Gambian dalasi', currencyCode: 'GMD', currencySymbol: 'D', flag: 'Gambia.png'},
    {currencyName: 'Georgian lari', currencyCode: 'GEL', currencySymbol: '₾', flag: 'Georgia.png'},
    {currencyName: 'Guinean franc', currencyCode: 'GNF', currencySymbol: 'Fr', flag: 'Guinea.png'},
    {currencyName: 'Haitian gourde', currencyCode: 'HTG', currencySymbol: 'G', flag: 'Haiti.png'},
    {currencyName: 'Iraqi dinar', currencyCode: 'IQD', currencySymbol: 'ع.د', flag: 'Iraq.png'},
    {currencyName: 'Jordanian dinar', currencyCode: 'JOD', currencySymbol: 'د.ا', flag: 'Jordan.png'},
    {currencyName: 'Kenyan shilling', currencyCode: 'KES', currencySymbol: 'Sh', flag: 'Kenya.png'},
    {currencyName: 'Kuwaiti dinar', currencyCode: 'KWD', currencySymbol: 'د.ك', flag: 'Kuwait.png'},
    {currencyName: 'Lesotho loti', currencyCode: 'LSL', currencySymbol: 'L', flag: 'Lesotho.png'},
    {currencyName: 'Libyan dinar', currencyCode: 'LYD', currencySymbol: 'ل.د', flag: 'Libya.png'},
    {currencyName: 'Macanese pataca', currencyCode: 'MOP', currencySymbol: 'P', flag: 'Macao.png'},
    {currencyName: 'Malagasy ariary', currencyCode: 'MGA', currencySymbol: 'Ar', flag: 'Madagascar.png'},
    {currencyName: 'Malawian kwacha', currencyCode: 'MWK', currencySymbol: 'MK', flag: 'Malawi.png'},
    {currencyName: 'Maldivian rufiyaa', currencyCode: 'MVR', currencySymbol: '.ރ', flag: 'Maldives.png'},
    {currencyName: 'Mauritanian ouguiya', currencyCode: 'MRU', currencySymbol: 'UM', flag: 'Mauritania.png'},
    {currencyName: 'Moldovan leu', currencyCode: 'MDL', currencySymbol: 'L', flag: 'Moldova.png'},
    {currencyName: 'Moroccan dirham', currencyCode: 'MAD', currencySymbol: 'د.م.', flag: 'Morocco.png'},
    {currencyName: 'Myanmar kyat', currencyCode: 'MMK', currencySymbol: 'Ks', flag: 'MyanmarBurma.png'},
    {currencyName: 'Papua New Guinean kina', currencyCode: 'PGK', currencySymbol: 'K', flag: 'PapuaNewGuinea.png'},
    {currencyName: 'Rwandan franc', currencyCode: 'RWF', currencySymbol: 'Fr', flag: 'Rwanda.png'},
    {currencyName: 'Samoan tala', currencyCode: 'WST', currencySymbol: 'T', flag: 'Samoa.png'},
    {currencyName: 'Sao Tome and Principe dobra', currencyCode: 'STN', currencySymbol: 'Db', flag: 'SaoTome&Principe.png'},
    {currencyName: 'Sierra Leonean leone', currencyCode: 'SLL', currencySymbol: 'Le', flag: 'SierraLeone.png'},
    {currencyName: 'South Sudanese pound', currencyCode: 'SSP', currencySymbol: '£', flag: 'SouthSudan.png'},
    {currencyName: 'Sudanese pound', currencyCode: 'SDG', currencySymbol: 'ج.س.', flag: 'Sudan.png'},
    {currencyName: 'Tajikistani somoni', currencyCode: 'TJS', currencySymbol: 'ЅМ', flag: 'Tajikistan.png'},
    {currencyName: 'Tanzanian shilling', currencyCode: 'TZS', currencySymbol: 'Sh', flag: 'Tanzania.png'},
    {currencyName: 'Tongan pa’anga', currencyCode: 'TOP', currencySymbol: 'T$', flag: 'Tonga.png'},
    {currencyName: 'Tunisian dinar', currencyCode: 'TND', currencySymbol: 'د.ت', flag: 'Tunisia.png'},
    {currencyName: 'Turkmen manat', currencyCode: 'TMT', currencySymbol: 'm', flag: 'Turkmenistan.png'},
    {currencyName: 'Ugandan shilling', currencyCode: 'UGX', currencySymbol: 'Sh', flag: 'Uganda.png'},
    {currencyName: 'UAE dirham', currencyCode: 'AED', currencySymbol: 'د.إ', flag: 'UnitedArabEmirates.png'},
    {currencyName: 'Vanuatu vatu', currencyCode: 'VUV', currencySymbol: 'Vt', flag: 'Vanutau.png'},
    {currencyName: 'Venezuelan bolivar', currencyCode: 'VES', currencySymbol: 'Bs.', flag: 'Venezuela.png'},
    {currencyName: 'Zambian kwacha', currencyCode: 'ZMW', currencySymbol: 'ZK.', flag: 'Zambia.png'}
  ];
  constructor() { }

  getCurrency(): CurrencyModel[] {
    return this.cur.sort((a, b) => a.currencyName.localeCompare(b.currencyName));
  }
}
