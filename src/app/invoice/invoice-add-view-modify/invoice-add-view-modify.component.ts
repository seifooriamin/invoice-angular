import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../shared/services/company.service';
import {Observable, Subscription} from 'rxjs';
import {CompanyModel} from '../../shared/models/company.model';
import {environment} from '../../../environments/environment';
import {CustomerService} from '../../shared/services/customer.service';
import {CustomerModel} from '../../shared/models/customer.model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {InvoiceRowsService} from '../../shared/services/invoice-rows.service';
import {ToolsService} from '../../shared/services/tools.service';
import {InvoiceService} from '../../shared/services/invoice.service';



@Component({
  selector: 'app-invoice-add-view-modify',
  templateUrl: './invoice-add-view-modify.component.html',
  styleUrls: ['./invoice-add-view-modify.component.css'],
})
export class InvoiceAddViewModifyComponent implements OnInit, OnDestroy {
  pageStatus = 'new';
  pageTitle = 'New Invoice Registration';
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  fillForm: FormGroup;
  fillFormRows: FormGroup;
  invoiceRows: FormArray;
  subscription: Subscription;
  currentUser: any;
  additionDeductionMode = [{value: 0, name: '%'} , {value: 1, name: 'Flat Rate'}];
  date = new Date();
  imgUrl = `${environment.imageDefault}`;
  companyList: CompanyModel[];
  companyInfo: CompanyModel = {id: 0, name: '', address: '', logo_link: '', email: '', business_no: '',
  gst_no: '', website: '', user_id: 0, phone: '', created: this.date, first_name: '', last_name: '', modified: this.date};
  customerList: CustomerModel[];
  customerInfo: CustomerModel = {id: 0, address: '', created: this.date, email: '', first_name: '', last_name: '',
    modified: this.date, name: '', phone: '', user_id: 0};
  descriptionText: string[] = [];

  searchDescription = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => term.length < 1 ? []
              : this.descriptionText.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      )

  constructor(private router: Router, private companyService: CompanyService, private formBuilder: FormBuilder,
              private customerService: CustomerService, private invoiceRowsService: InvoiceRowsService,
              private toolsService: ToolsService, private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.initFormNew();
    this.getDescription();
    this.onSetInvoiceNumberDefault();
  }
  onSetInvoiceNumberDefault() {
    this.toolsService.getInvoiceNumber().then(
        (response) => {
          if (response['invoicePrefix']) {
            this.fillForm.patchValue({
              no: response['invoiceDigit'],
              invoice_no: response['invoicePrefix'] + response['invoiceDigit']
            });
          } else {
            let currentYear = new Date().getFullYear().toString();
            currentYear += '-';
            this.fillForm.patchValue({
              no: response['invoiceDigit'],
              invoice_no: currentYear + response['invoiceDigit']
            });
          }

        });
  }
  getDescription() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscription = this.invoiceRowsService.getInvoiceRowsDescription(userId).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.descriptionText.push(rowsDescription.description);
          }
        }, (e) => {}
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  initFormNew() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscription = this.companyService.companyReadByUser(userId).subscribe(
        (response) => {
            this.companyList = response['records'];
        }, (e) => {

        }
    );
    this.subscription = this.customerService.customerReadByUser(userId).subscribe(
        (response) => {
          this.customerList = response['records'];
        }, (e) => {

        }
    );
    this.fillForm = this.formBuilder.group({
      date : ['', [Validators.required,
        Validators.pattern('^(([0-2]+\\d{1})|([3]+[0,1]{1}))-([0,1]+\\d{1})-([1-9]{1}\\d{3})$')]],
      invoice_no: ['', [Validators.required,
          Validators.pattern('^([a-zA-Z0-9-_\\\\\\/]{0,10})([0-9]{1,6})$')]],
      no: [''],
      year: [''],
      company_id : ['', Validators.required],
      customer_id : ['', Validators.required],
      addition1 : [''],
      addition2 : [''],
      addition3 : [''],
      deduction1 : [''],
      deduction2 : [''],
    });
    this.fillFormRows = this.formBuilder.group({
      invoiceRows: this.formBuilder.array([this.onCreateRow()])
    });
  }
  onCreateRow(): FormGroup {
    return this.formBuilder.group({
      inx: '',
      invoice_id: '',
      description: '',
      comment: [''],
      unit_price: ['', [Validators.required,
          Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$')]],
      unit_measure: [''],
      quantity: ['', [Validators.required,
        Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$')]],
      user_id: ['', Validators.required]
    });
  }
  onSetYear() {
    const selectedDate: string = this.f.date.value;
    const selectedYear = selectedDate.substr(6, 4);
    this.fillForm.patchValue({
      year: selectedYear
    });
  }
  onCurrencyShow(amount, index) {
    const i = this.toolsService.showNumberWithDecimal(amount);
    this.invoiceRows = this.fillFormRows.get('invoiceRows') as FormArray;
    this.invoiceRows.at(index).get('unit_price').setValue(i);

  }
  onBack() {
    this.router.navigate(['/invoice/invoice-list']);
  }
  get f() { return this.fillForm.controls; }
  get q() { return this.fillFormRows.controls; }
  get s() {return this.fillFormRows.get('invoiceRows') as FormArray; }


  onModify() {

  }
  onSubmit() {
    // console.log(this.fillFormRows.controls.invoiceRows.controls[0].value);
    console.log(this.fillForm.value);
  }
  onLoadCompanyData(companyID) {
    this.companyInfo = this.companyList.find(company => company.id === companyID);
    if (this.companyInfo.logo_link) {
      this.imgUrl = `${environment.imageUrl}` + this.companyInfo.logo_link;
    } else {
      this.imgUrl = `${environment.imageDefault}`;
    }
  }
  onLoadCustomerData(customerID) {
    this.customerInfo = this.customerList.find(customer => customer.id === customerID);
  }
  onAddCompany() {
    this.router.navigate(['/company/new']);
  }
  onAddCustomer() {
    this.router.navigate(['/customer/new']);
  }
  onRemoveLine(lineIndex) {
    this.invoiceRows = this.fillFormRows.get('invoiceRows') as FormArray;
    this.invoiceRows.removeAt(lineIndex);
  }
  onAddLine() {
    this.invoiceRows = this.fillFormRows.get('invoiceRows') as FormArray;
    this.invoiceRows.push(this.onCreateRow());
  }
}
