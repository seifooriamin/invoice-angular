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
import {InvoiceGeneralSettingService} from '../../shared/services/invoice-general-setting.service';
import {InvoiceGeneralSettingModel} from '../../shared/models/invoice-general-setting.model';
declare var jQuery: any;

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
  settingForm: FormGroup;
  invoiceRows: FormArray;
  subscription: Subscription;
  currentUser: any;
  jUserID = '';
  date = new Date();
  imgUrl = `${environment.imageDefault}`;
  companyList: CompanyModel[];
  companyInfo: CompanyModel = {id: 0, name: '', address: '', logo_link: '', email: '', business_no: '',
  gst_no: '', website: '', user_id: 0, phone: '', created: this.date, first_name: '', last_name: '', modified: this.date};
  customerList: CustomerModel[];
  customerInfo: CustomerModel = {id: 0, address: '', created: this.date, email: '', first_name: '', last_name: '',
    modified: this.date, name: '', phone: '', user_id: 0};
  descriptionText: string[] = [];
  commentText: string[] = [];
  unitMeasureText: string[] = [];
  rowTotalString: string[] = [];
  rowTotalNumber: number[] = [];
  invoiceSubTotal: '';
  invoiceSettingElements: InvoiceGeneralSettingModel = {
    id: 0,
    user_id: 0,
    created: this.date,
    modified: this.date,
    deduction1status: 1,
    deduction1label: '',
    deduction1type: '',
    deduction1percentage: 0,
    deduction2status: 1,
    deduction2label: '',
    deduction2type: '',
    deduction2percentage: 0,
    addition1status: 1,
    addition1label: '',
    addition1type: '',
    addition1percentage: 0,
    addition2status: 1,
    addition2label: '',
    addition2type: '',
    addition2percentage: 0,
    addition3status: 1,
    addition3label: '',
    addition3type: '',
    addition3percentage: 0
  };

  searchDescription = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => term.length < 1 ? []
              : this.descriptionText.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      )
  searchComment = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => term.length < 1 ? []
              : this.commentText.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      )
  searchUnitMeasure = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(200),
          distinctUntilChanged(),
          map(term => term.length < 1 ? []
              : this.unitMeasureText.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
      )

  constructor(private router: Router, private companyService: CompanyService, private formBuilder: FormBuilder,
              private customerService: CustomerService, private invoiceRowsService: InvoiceRowsService,
              private toolsService: ToolsService, private invoiceService: InvoiceService,
              private igs: InvoiceGeneralSettingService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.jUserID = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.initSettingForm();
    this.fillSettingForm();
    this.initFormNew();
    this.getDescription();
    this.getComment();
    this.getUnitMeasure();
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
    this.subscription = this.invoiceRowsService.getInvoiceRowsDescription(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.descriptionText.push(rowsDescription.description);
          }
        }, (e) => {}
    );
  }
  getComment() {
    this.subscription = this.invoiceRowsService.getInvoiceRowsComment(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.commentText.push(rowsDescription.comment);
          }
        }, (e) => {}
    );
  }
  getUnitMeasure() {
    this.subscription = this.invoiceRowsService.getInvoiceRowsUnitMeasure(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.unitMeasureText.push(rowsDescription.unit_measure);
          }
        }, (e) => {}
    );
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  onRowTotal(index) {
    const unitPrice = this.s.at(index).get('unit_price').value;
    const quantity = this.s.at(index).get('quantity').value;
    const rowTotalNumberLocal = this.toolsService.showNumberWithDecimal((unitPrice * quantity));
    this.rowTotalNumber.splice(index, 0, rowTotalNumberLocal);
    this.rowTotalString.splice(index, 0, this.toolsService.numberSeparator(rowTotalNumberLocal));
    this.rowTotalString.splice(index + 1, this.rowTotalString.length - index);
    this.rowTotalNumber.splice(index + 1, this.rowTotalNumber.length - index);
    this.calcSubTotal();
  }
  calcSubTotal() {
    let invoiceSubTotalLocal = 0;
    for (const rowTotal of this.rowTotalNumber) {
      invoiceSubTotalLocal +=  +rowTotal;
    }
    invoiceSubTotalLocal = this.toolsService.showNumberWithDecimal(invoiceSubTotalLocal);
    this.invoiceSubTotal = this.toolsService.numberSeparator(invoiceSubTotalLocal);
  }
  initFormNew() {
    this.subscription = this.companyService.companyReadByUser(this.jUserID).subscribe(
        (response) => {
            this.companyList = response['records'];
        }, (e) => {

        }
    );
    this.subscription = this.customerService.customerReadByUser(this.jUserID).subscribe(
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
      note: [''],
      invoice_id: [''],
      user_id : [''],
      company_id : ['', Validators.required],
      customer_id : ['', Validators.required],
      addition1 : [''],
      addition1Percentage : ['5'],
      addition2 : [''],
      addition2Percentage : ['7'],
      addition3 : [''],
      addition3Percentage : ['0'],
      deduction1 : [''],
      deduction1Percentage : ['0'],
      deduction2 : [''],
      deduction2Percentage : ['0'],
      id: [''],
    });
    this.fillFormRows = this.formBuilder.group({
      invoiceRows: this.formBuilder.array([this.onCreateRow()])
    });
  }
  initSettingForm() {
    this.settingForm = this.formBuilder.group({
      deduction1status: [''],
      deduction1label: [''],
      deduction1type: [''],
      deduction1percentage: [''],
      deduction2status: [''],
      deduction2label: [''],
      deduction2type: [''],
      deduction2percentage: [''],
      addition1status: [''],
      addition1label: [''],
      addition1type: [''],
      addition1percentage: [''],
      addition2status: [''],
      addition2label: [''],
      addition2type: [''],
      addition2percentage: [''],
      addition3status: [''],
      addition3label: [''],
      addition3type: [''],
      addition3percentage: [''],
    });
  }
  fillSettingForm() {
    this.subscription = this.igs.readInvoiceSetting(this.jUserID).subscribe(
        (response: InvoiceGeneralSettingModel) => {
          this.settingForm.patchValue({
            deduction1status: +response.deduction1status === 1,
            deduction1label: response.deduction1label,
            deduction1type: response.deduction1type,
            deduction1percentage: response.deduction1percentage,
            deduction2status: +response.deduction2status === 1,
            deduction2label: response.deduction2label,
            deduction2type: response.deduction2type,
            deduction2percentage: response.deduction2percentage,
            addition1status: +response.addition1status === 1,
            addition1label: response.addition1label,
            addition1type: response.addition1type,
            addition1percentage: response.addition1percentage,
            addition2status: +response.addition2status === 1,
            addition2label: response.addition2label,
            addition2type: response.addition2type,
            addition2percentage: response.addition2percentage,
            addition3status: +response.addition3status === 1,
            addition3label: response.addition3label,
            addition3type: response.addition3type,
            addition3percentage: response.addition3percentage
          });
          this.invoiceSettingElements = response;
        }
    );
  }
  onSaveSetting() {
    this.invoiceSettingElements = this.settingForm.value;
    jQuery('#modalSetting').modal('hide');
  }
  onSettingSubmit() {}
  onSettingCall() {
      jQuery('#modalSetting').modal('show');
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
  onSetUserId() {
    const jCurrentUser = this.toolsService.getUserID();
    this.fillForm.patchValue({
      user_id: jCurrentUser['id']
    });
  }
  onSetInvoiceRowUserId(index) {
    const jCurrentUser = this.toolsService.getUserID();
    this.s.at(index).get('user_id').setValue(jCurrentUser['id']);
  }
  onSetYear() {
    const selectedDate: string = this.f.date.value;
    const selectedYear = selectedDate.substr(6, 4);
    this.fillForm.patchValue({
      year: selectedYear
    });
  }
  onCurrencyShow(amount, index) {
    const numDecimal = this.toolsService.showNumberWithDecimal(amount);
    this.s.at(index).get('unit_price').setValue(numDecimal);

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
    this.rowTotalString.splice(lineIndex, 1);
    this.rowTotalNumber.splice(lineIndex, 1);
    this.invoiceRows.removeAt(lineIndex);
  }
  onAddLine() {
    this.invoiceRows = this.fillFormRows.get('invoiceRows') as FormArray;
    this.invoiceRows.push(this.onCreateRow());
  }

}
