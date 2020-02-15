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
import {CurrencyModel} from '../../shared/models/currency.model';
import {CurrencyService} from '../../shared/services/currency.service';
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
  invoiceSubTotal = '';
  invoiceSubTotalDigit = 0;
  invoiceTotal = '';
  invoiceTotalDigit: number;
  selectedCurrencyImage: string;
  selectedCurrencyCode: string;
  selectedCurrencySymbol: string;
  currency: CurrencyModel[] = [];
  invoiceSettingElements: InvoiceGeneralSettingModel = {
    id: 0,
    user_id: 0,
    currency: '',
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
              private igs: InvoiceGeneralSettingService, private currencyService: CurrencyService) { }

  ngOnInit() {
    this.currency = this.currencyService.getCurrency();
    this.jUserID = this.toolsService.getUserIDJson();
    this.initSettingForm();
    this.fillSettingForm();
    this.initFormNew();
    this.getDescription();
    this.getComment();
    this.getUnitMeasure();
    this.onSetInvoiceNumberDefault();
  }
  onSetInvoiceNumberDefault() {
    this.invoiceService.setNewInvoiceNumber().then(
        (response) => {
          if (response['invoicePrefix']) {
            this.fillForm.patchValue({
              invoice_number: response['invoicePrefix'] + response['invoiceDigit']
            });
          } else {
            let currentYear = new Date().getFullYear().toString();
            currentYear += '-';
            this.fillForm.patchValue({
              invoice_number: currentYear + response['invoiceDigit']
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
    // this.rowTotalString.splice(index, 0, this.toolsService.numberSeparator(rowTotalNumberLocal));
    // this.rowTotalString.splice(index + 1, this.rowTotalString.length - index);
    this.rowTotalNumber.splice(index + 1, this.rowTotalNumber.length - index);
    this.calcSubTotal();
    this.calcTotal();
    this.onAddCurrencySymbol();
  }
  calcSubTotal() {
    let invoiceSubTotalLocal = 0;
    for (const rowTotal of this.rowTotalNumber) {
      invoiceSubTotalLocal +=  +rowTotal;
    }
    invoiceSubTotalLocal = this.toolsService.showNumberWithDecimal(invoiceSubTotalLocal);
    this.invoiceSubTotal = this.toolsService.numberSeparator(invoiceSubTotalLocal);
    this.invoiceSubTotalDigit = invoiceSubTotalLocal;
  }
  calcTotal() {
    let deduction1 = 0;
    let deduction2 = 0;
    let addition1 = 0;
    let addition2 = 0;
    let addition3 = 0;
    let totalLocal = this.invoiceSubTotalDigit;
    if (this.invoiceSettingElements.deduction1type === 'D1P' && +this.invoiceSettingElements.deduction1status === 1) {
      deduction1 = this.toolsService.showNumberWithDecimal(
          (this.invoiceSubTotalDigit * this.invoiceSettingElements.deduction1percentage) / 100);
      this.f.deduction1.setValue(this.toolsService.numberSeparator(deduction1));
    } else {
      if (+this.invoiceSettingElements.deduction1status === 1) {
        deduction1 = this.toolsService.showNumberWithDecimal(this.f.deduction1.value);
        this.f.deduction1.setValue(deduction1);
      }
      if (+this.invoiceSettingElements.deduction1status === 0) {
        deduction1 = this.toolsService.showNumberWithDecimal(this.f.deduction1.value);
        this.f.deduction1.setValue(0);
      }
    }
    totalLocal -= deduction1;
    if (this.invoiceSettingElements.deduction2type === 'D2P' && +this.invoiceSettingElements.deduction2status === 1) {
      deduction2 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.invoiceSettingElements.deduction2percentage) / 100);
      this.f.deduction2.setValue(this.toolsService.numberSeparator(deduction2));
    } else {
      if (+this.invoiceSettingElements.deduction2status === 1) {
        deduction2 = this.toolsService.showNumberWithDecimal(this.f.deduction2.value);
        this.f.deduction2.setValue(deduction2);
      }
      if (+this.invoiceSettingElements.deduction2status === 0) {
        deduction2 = this.toolsService.showNumberWithDecimal(this.f.deduction2.value);
        this.f.deduction2.setValue(0);
      }
    }
    totalLocal -= deduction2;
    if (this.invoiceSettingElements.addition1type === 'A1P' && +this.invoiceSettingElements.addition1status === 1) {
      addition1 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.invoiceSettingElements.addition1percentage) / 100);
      this.f.addition1.setValue(this.toolsService.numberSeparator(addition1));
    } else {
      if (+this.invoiceSettingElements.addition1status === 1) {
        addition1 = this.toolsService.showNumberWithDecimal(this.f.addition1.value);
        this.f.addition1.setValue(addition1);
      }
      if (+this.invoiceSettingElements.addition1status === 0) {
        addition1 = this.toolsService.showNumberWithDecimal(this.f.addition1.value);
        this.f.addition1.setValue(0);
      }
    }
    if (this.invoiceSettingElements.addition2type === 'A2P' && +this.invoiceSettingElements.addition2status === 1) {
      addition2 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.invoiceSettingElements.addition2percentage) / 100);
      this.f.addition2.setValue(this.toolsService.numberSeparator(addition2));
    } else {
      if (+this.invoiceSettingElements.addition2status === 1) {
        addition2 = this.toolsService.showNumberWithDecimal(this.f.addition2.value);
        this.f.addition2.setValue(addition2);
      }
      if (+this.invoiceSettingElements.addition2status === 0) {
        addition2 = this.toolsService.showNumberWithDecimal(this.f.addition2.value);
        this.f.addition2.setValue(0);
      }
    }
    if (this.invoiceSettingElements.addition3type === 'A3P' && +this.invoiceSettingElements.addition3status === 1) {
      addition3 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.invoiceSettingElements.addition3percentage) / 100);
      this.f.addition3.setValue(this.toolsService.numberSeparator(addition3));
    } else {
      if (+this.invoiceSettingElements.addition3status === 1) {
        addition3 = this.toolsService.showNumberWithDecimal(this.f.addition3.value);
        this.f.addition3.setValue(addition3);
      }
      if (+this.invoiceSettingElements.addition3status === 0) {
        addition3 = this.toolsService.showNumberWithDecimal(this.f.addition3.value);
        this.f.addition3.setValue(0);
      }
    }
    totalLocal = +totalLocal + +addition1 + +addition2 + +addition3;
    this.invoiceTotalDigit = this.toolsService.showNumberWithDecimal(totalLocal);
    this.invoiceTotal = this.toolsService.numberSeparator(this.invoiceTotalDigit);
  }
  onAddCurrencySymbol() {
    this.invoiceTotal = this.selectedCurrencySymbol + this.toolsService.numberSeparator(this.invoiceTotalDigit);
    this.invoiceSubTotal = this.selectedCurrencySymbol + this.toolsService.numberSeparator(this.invoiceSubTotalDigit);
    for (let rows = 0; rows < this.rowTotalNumber.length; rows++) {
      const str = this.selectedCurrencySymbol + this.toolsService.numberSeparator(this.rowTotalNumber[rows]);
      this.rowTotalString.splice(rows, 0, str);
    }
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
        Validators.pattern('^([1-9]{1}\\d{3})-([0,1]+\\d{1})-(([0-2]+\\d{1})|([3]+[0,1]{1}))$')]],
      invoice_number: ['', [Validators.required,
          Validators.pattern('^([a-zA-Z0-9-_\\\\\\/]{0,10})([0-9]{1,6})$')]],
      year: [''],
      note: ['', Validators.maxLength(256)],
      user_id : [''],
      company_id : ['', Validators.required],
      customer_id : ['', Validators.required],
      addition1 : ['0'],
      addition1Percentage : [''],
      addition2 : ['0'],
      addition2Percentage : [''],
      addition3 : ['0'],
      addition3Percentage : [''],
      deduction1 : ['0'],
      deduction1Percentage : [''],
      deduction2 : ['0'],
      deduction2Percentage : [''],
      id: [''],
    });
    this.fillFormRows = this.formBuilder.group({
      invoiceRows: this.formBuilder.array([this.onCreateRow()])
    });
  }
  initSettingForm() {
    this.settingForm = this.formBuilder.group({
      invoice_id: [''],
      currency: [''],
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
            currency: response.currency,
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
          this.selectedCurrencyImage = environment.flagUrl +
              this.currency.find(({currencyCode}) => currencyCode === response.currency).flag;
          this.selectedCurrencyCode = this.currency.find(({currencyCode}) =>
              currencyCode === response.currency).currencyCode;
          this.selectedCurrencySymbol = this.currency.find(({currencyCode}) =>
              currencyCode === response.currency).currencySymbol;
        }
    );
  }
  // This function is used for change int to decimal for addition and deduction part
  showFormControlName(formControl) {
    formControl.setValue(this.toolsService.showNumberWithDecimal(formControl.value));
    this.calcTotal();
  }
  // This function is used for change int to decimal for addition and deduction part
  onSaveSetting() {
    this.invoiceSettingElements = this.settingForm.value;
    this.calcTotal();
    jQuery('#modalSetting').modal('hide');
    this.onAddCurrencySymbol();
  }
  onCancelSetting() {
    this.settingForm.patchValue({
      currency: this.invoiceSettingElements.currency,
      deduction1status: +this.invoiceSettingElements.deduction1status === 1,
      deduction1label: this.invoiceSettingElements.deduction1label,
      deduction1type: this.invoiceSettingElements.deduction1type,
      deduction1percentage: this.invoiceSettingElements.deduction1percentage,
      deduction2status: +this.invoiceSettingElements.deduction2status === 1,
      deduction2label: this.invoiceSettingElements.deduction2label,
      deduction2type: this.invoiceSettingElements.deduction2type,
      deduction2percentage: this.invoiceSettingElements.deduction2percentage,
      addition1status: +this.invoiceSettingElements.addition1status === 1,
      addition1label: this.invoiceSettingElements.addition1label,
      addition1type: this.invoiceSettingElements.addition1type,
      addition1percentage: this.invoiceSettingElements.addition1percentage,
      addition2status: +this.invoiceSettingElements.addition2status === 1,
      addition2label: this.invoiceSettingElements.addition2label,
      addition2type: this.invoiceSettingElements.addition2type,
      addition2percentage: this.invoiceSettingElements.addition2percentage,
      addition3status: +this.invoiceSettingElements.addition3status === 1,
      addition3label: this.invoiceSettingElements.addition3label,
      addition3type: this.invoiceSettingElements.addition3type,
      addition3percentage: this.invoiceSettingElements.addition3percentage
    });
    this.selectedCurrencyImage = environment.flagUrl +
        this.currency.find(({currencyCode}) => currencyCode === this.invoiceSettingElements.currency).flag;
    this.selectedCurrencyCode = this.currency.find(
        ({currencyCode}) => currencyCode === this.invoiceSettingElements.currency).currencyCode;
    this.selectedCurrencySymbol = this.currency.find(
        ({currencyCode}) => currencyCode === this.invoiceSettingElements.currency).currencySymbol;
  }
  onSettingSubmit() {}
  onSettingCall() {
      jQuery('#modalSetting').modal('show');
  }
  onCreateRow(): FormGroup {
    return this.formBuilder.group({
      inx: '',
      invoice_id: '',
      description: ['', [Validators.required, Validators.maxLength(70),
           Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*\\@*\\#*\\%*\\(*\\)*\\&*\\**\\+*\\-*\\=*)*$')]],
      comment: ['', [Validators.maxLength(70),
           Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*\\@*\\#*\\%*\\(*\\)*\\&*\\**\\+*\\-*\\=*)*$')]],
      unit_price: ['', [Validators.required,
           Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$')]],
      unit_measure: ['', [Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*\\@*\\#*\\%*\\(*\\)*\\&*\\**\\+*\\-*\\=*)*$'),
           Validators.maxLength(10)]],
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
    const selectedYear = selectedDate.substr(0, 4);
    this.fillForm.patchValue({
      year: selectedYear
    });
  }
  onCurrencyShow(amount, index) {
    const numDecimal = this.toolsService.showNumberWithDecimal(amount);
    this.s.at(index).get('unit_price').setValue(numDecimal);

  }
  onNumberCorrection(quantity, index) {
    const correctedNum = this.toolsService.numberCorrection(quantity);
    this.s.at(index).get('quantity').setValue(correctedNum);
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
    if (this.pageStatus === 'new') {
      if (this.fillForm.valid && this.fillFormRows.valid && this.settingForm.valid) {
        this.subscription = this.invoiceService.invoiceCreate(this.fillForm.value).subscribe(
            (response) => {
              if (response['message'] === 'SUCCESS') {
                this.subscription = this. subscription = this.invoiceService.getInvoiceNumber(this.jUserID).subscribe(
                    (invoiceID) => {
                        this.settingForm.get('invoice_id').setValue(invoiceID['id']);
                        for (let row = 0; row < this.s.length; row++) {
                          this.s.at(row).get('invoice_id').setValue(invoiceID['id']);
                        }
                        for (const rowData of this.s.value) {
                          console.log(rowData); //here is the start of the task
                        }
                    } , () => {
                      this.submitMessage = 'Unexpected error occurred, may your invoice has not been saved completely';
                      this.submitMessageStatusFail = true;
                      setTimeout(() => {
                        this.submitMessageStatusFail = false;
                      }, 3000);
                    }
                );
              }
            }
        );
      } else {
        this.submitMessage = 'Fill all the mandatory fields, stared* fields are mandatory';
        this.submitMessageStatusFail = true;
        setTimeout(() => {
          this.submitMessageStatusFail = false;
        }, 3000);
      }
    }
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
    this.calcSubTotal();
    this.calcTotal();
  }
  onAddLine() {
    this.invoiceRows = this.fillFormRows.get('invoiceRows') as FormArray;
    this.invoiceRows.push(this.onCreateRow());
  }
  changeCurrency(currencySelected) {
    this.selectedCurrencyImage = environment.flagUrl +
        this.currency.find(({currencyCode}) => currencyCode === currencySelected).flag;
    this.selectedCurrencyCode = this.currency.find(({currencyCode}) => currencyCode === currencySelected).currencyCode;
    this.selectedCurrencySymbol = this.currency.find(({currencyCode}) =>
        currencyCode === currencySelected).currencySymbol;
  }
}
