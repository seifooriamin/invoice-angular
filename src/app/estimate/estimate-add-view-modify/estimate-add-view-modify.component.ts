import {Component, OnDestroy, OnInit} from '@angular/core';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import pdfMake from 'pdfmake/build/pdfmake';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {CompanyModel} from '../../shared/models/company.model';
import {CustomerModel} from '../../shared/models/customer.model';
import {CurrencyModel} from '../../shared/models/currency.model';
import {InvoiceGeneralSettingModel} from '../../shared/models/invoice-general-setting.model';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CompanyService} from '../../shared/services/company.service';
import {CustomerService} from '../../shared/services/customer.service';
import {ToolsService} from '../../shared/services/tools.service';
import {InvoiceGeneralSettingService} from '../../shared/services/invoice-general-setting.service';
import {CurrencyService} from '../../shared/services/currency.service';
import {EstimateRowsService} from '../../shared/services/estimate-rows.service';
import {EstimateService} from '../../shared/services/estimate.service';
import {EstimateCustomSettingService} from '../../shared/services/estimate-custom-setting.service';
import {EstimateModel} from '../../shared/models/estimate.model';
import {EstimateRowsModel} from '../../shared/models/estimate-rows.model';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var jQuery: any;

@Component({
  selector: 'app-estimate-add-view-modify',
  templateUrl: './estimate-add-view-modify.component.html',
  styleUrls: ['../../../my-style.css']
})
export class EstimateAddViewModifyComponent implements OnInit, OnDestroy {
  id = 0;
  pageStatus = 'new';
  pageTitle = 'New Estimate Registration';
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  fillForm: FormGroup;
  fillFormRows: FormGroup;
  settingForm: FormGroup;
  estimateRows: FormArray;
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
  savedEstimateID: number;
  imgBase64: string;
  currency: CurrencyModel[] = [];
  estimateSettingElements: InvoiceGeneralSettingModel = {
    id: 0,
    estimate_id: 0,
    invoice_id: 0,
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
  estimateInfo: EstimateModel;
  typeOptions = [{typeCode: 'P', typeName: 'Percentage'}, {typeCode: 'F', typeName: 'Flat Rate'}];

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
              private customerService: CustomerService, private estimateRowsService: EstimateRowsService,
              private toolsService: ToolsService, private estimateService: EstimateService,
              private igs: InvoiceGeneralSettingService, private currencyService: CurrencyService,
              private ecs: EstimateCustomSettingService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
    );
    if (this.id) {
      const url = this.router.url;
      if (url.slice(-6) === 'modify') {
        this.pageStatus = 'modify';
        this.pageTitle = 'Modify Estimate Information';
      } else {
        this.pageStatus = 'view';
        this.pageTitle = 'View Estimate Information';
      }
    }
    this.currency = this.currencyService.getCurrency();
    this.jUserID = this.toolsService.getUserIDJson();
    this.initSettingForm();
    this.initInvoiceForm();
    this.initInvoiceRowForm();
    this.onLoadCompanyCustomerList();
    this.getDescription();
    this.getComment();
    this.getUnitMeasure();
    if (this.pageStatus === 'new') {
      this.fillSettingForm();
      this.onSetEstimateNumberDefault();
    } else {
      this.fillEstimateForm();
      this.fillEstimateSettingForm();
      this.fillEstimateRowsForm();
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  async fillEstimateForm() {
    this.subscription = this.estimateService.estimateByID(this.id).subscribe(
        (response) => {
          this.onLoadCompanyData(response.company_id);
          this.onLoadCustomerData(response.customer_id);
          this.fillForm.patchValue({
            date: response.date,
            estimate_number: response.estimate_number,
            company_id: response.company_id,
            customer_id: response.customer_id,
            id: response.id,
            note: response.note,
            user_id: response.user_id,
            addition1: response.addition1,
            addition2: response.addition2,
            addition3: response.addition3,
            deduction1: response.deduction1,
            deduction2: response.deduction2
          });
          this.estimateInfo = response;
        }, () => {}
    );

  }
  async fillEstimateRowsForm() {
    this.subscription = this.estimateRowsService.estimateRowsByEstimateID(this.id).subscribe(
        (response: EstimateRowsModel[]) => {
          let i = 0;
          for (const row of response['records']) {
            this.onAddLine();
            this.s.at(i).patchValue({
              id: row.id,
              inx: row.inx,
              estimate_id: row.estimate_id,
              description: row.description,
              comment: row.comment,
              unit_price: row.unit_price,
              unit_measure: row.unit_measure,
              quantity: row.quantity,
              user_id: row.user_id
            });
            this.onRowTotal(i);
            i++;
          }
        }, () => {}
    );
  }
  async fillEstimateSettingForm() {
    this.subscription = this.ecs.estimateSettingByEstimateID(this.id).subscribe(
        (response: InvoiceGeneralSettingModel) => {
          this.settingForm.patchValue({
            currency: response.currency,
            id: response.id,
            estimate_id: response.estimate_id,
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
          this.estimateSettingElements = response;
          try {
            this.selectedCurrencyImage = environment.flagUrl +
                this.currency.find(({currencyCode}) => currencyCode === response.currency).flag;
            this.selectedCurrencyCode = this.currency.find(({currencyCode}) =>
                currencyCode === response.currency).currencyCode;
            this.selectedCurrencySymbol = this.currency.find(({currencyCode}) =>
                currencyCode === response.currency).currencySymbol;
          } catch {
            console.log('this is catch');
            window.location.reload();
          }

        }, () => {}
    );
  }
  async onSetEstimateNumberDefault() {
    this.estimateService.setNewEstimateNumber().then(
        (response) => {
          if (response['estimatePrefix']) {
            this.fillForm.patchValue({
              estimate_number: response['estimatePrefix'] + response['estimateDigit']
            });
          } else if (response['estimateDigit'] === '001') {
            let currentYear = new Date().getFullYear().toString();
            currentYear += '-';
            this.fillForm.patchValue({
              estimate_number: currentYear + response['estimateDigit']
            });
          } else {
            this.fillForm.patchValue({
              estimate_number: response['estimateDigit']
            });
          }
        });
  }
  async getDescription() {
    this.subscription = this.estimateRowsService.getEstimateRowsDescription(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.descriptionText.push(rowsDescription.description);
          }
        }, () => {}
    );
  }
  async getComment() {
    this.subscription = this.estimateRowsService.getEstimateRowsComment(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.commentText.push(rowsDescription.comment);
          }
        }, () => {}
    );
  }
  async getUnitMeasure() {
    this.subscription = this.estimateRowsService.getEstimateRowsUnitMeasure(this.jUserID).subscribe(
        (response) => {
          for (const rowsDescription of response['records']) {
            this.unitMeasureText.push(rowsDescription.unit_measure);
          }
        }, () => {}
    );
  }
  onRowTotal(index) {
    const unitPrice = this.s.at(index).get('unit_price').value;
    const quantity = this.s.at(index).get('quantity').value;
    const rowTotalNumberLocal = this.toolsService.showNumberWithDecimal((unitPrice * quantity));
    this.rowTotalNumber.splice(index, 0, rowTotalNumberLocal);
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
    if (this.estimateSettingElements.deduction1type === 'P' && +this.estimateSettingElements.deduction1status === 1) {
      deduction1 = this.toolsService.showNumberWithDecimal(
          (this.invoiceSubTotalDigit * this.estimateSettingElements.deduction1percentage) / 100);
      this.f.deduction1.setValue(this.toolsService.numberSeparator(deduction1));
    } else {
      if (+this.estimateSettingElements.deduction1status === 1) {
        deduction1 = this.toolsService.showNumberWithDecimal(this.f.deduction1.value);
        this.f.deduction1.setValue(deduction1);
      }
      if (+this.estimateSettingElements.deduction1status === 0) {
        deduction1 = this.toolsService.showNumberWithDecimal(this.f.deduction1.value);
        this.f.deduction1.setValue(0);
      }
    }
    totalLocal -= deduction1;
    if (this.estimateSettingElements.deduction2type === 'P' && +this.estimateSettingElements.deduction2status === 1) {
      deduction2 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.estimateSettingElements.deduction2percentage) / 100);
      this.f.deduction2.setValue(this.toolsService.numberSeparator(deduction2));
    } else {
      if (+this.estimateSettingElements.deduction2status === 1) {
        deduction2 = this.toolsService.showNumberWithDecimal(this.f.deduction2.value);
        this.f.deduction2.setValue(deduction2);
      }
      if (+this.estimateSettingElements.deduction2status === 0) {
        deduction2 = this.toolsService.showNumberWithDecimal(this.f.deduction2.value);
        this.f.deduction2.setValue(0);
      }
    }
    totalLocal -= deduction2;
    if (this.estimateSettingElements.addition1type === 'P' && +this.estimateSettingElements.addition1status === 1) {
      addition1 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.estimateSettingElements.addition1percentage) / 100);
      this.f.addition1.setValue(this.toolsService.numberSeparator(addition1));
    } else {
      if (+this.estimateSettingElements.addition1status === 1) {
        addition1 = this.toolsService.showNumberWithDecimal(this.f.addition1.value);
        this.f.addition1.setValue(addition1);
      }
      if (+this.estimateSettingElements.addition1status === 0) {
        addition1 = this.toolsService.showNumberWithDecimal(this.f.addition1.value);
        this.f.addition1.setValue(0);
      }
    }
    if (this.estimateSettingElements.addition2type === 'P' && +this.estimateSettingElements.addition2status === 1) {
      addition2 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.estimateSettingElements.addition2percentage) / 100);
      this.f.addition2.setValue(this.toolsService.numberSeparator(addition2));
    } else {
      if (+this.estimateSettingElements.addition2status === 1) {
        addition2 = this.toolsService.showNumberWithDecimal(this.f.addition2.value);
        this.f.addition2.setValue(addition2);
      }
      if (+this.estimateSettingElements.addition2status === 0) {
        addition2 = this.toolsService.showNumberWithDecimal(this.f.addition2.value);
        this.f.addition2.setValue(0);
      }
    }
    if (this.estimateSettingElements.addition3type === 'P' && +this.estimateSettingElements.addition3status === 1) {
      addition3 = this.toolsService.showNumberWithDecimal(
          (totalLocal * this.estimateSettingElements.addition3percentage) / 100);
      this.f.addition3.setValue(this.toolsService.numberSeparator(addition3));
    } else {
      if (+this.estimateSettingElements.addition3status === 1) {
        addition3 = this.toolsService.showNumberWithDecimal(this.f.addition3.value);
        this.f.addition3.setValue(addition3);
      }
      if (+this.estimateSettingElements.addition3status === 0) {
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
  initInvoiceForm() {
    this.fillForm = this.formBuilder.group({
      date : [{disabled: this.pageStatus === 'view', value: ''}, [Validators.required,
        Validators.pattern('^([1-9]{1}\\d{3})-([0,1]+\\d{1})-(([0-2]+\\d{1})|([3]+[0,1]{1}))$')]],
      estimate_number: ['', [Validators.required,
        Validators.pattern('^([a-zA-Z0-9-_\\\\\\/]{0,10})([0-9]{1,6})$')]],
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
  }
  initInvoiceRowForm() {
    if (this.pageStatus === 'new') {
      this.fillFormRows = this.formBuilder.group({
        estimateRows: this.formBuilder.array([this.onCreateRow()])
      });
    } else {
      this.fillFormRows = this.formBuilder.group({
        estimateRows: this.formBuilder.array([])
      });
    }
  }
  async onLoadCompanyCustomerList() {
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
  }
  initSettingForm() {
    this.settingForm = this.formBuilder.group({
      estimate_id: [''],
      id: [''],
      currency: [''],
      deduction1status: [''],
      deduction1label: ['', [Validators.required, Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'),
        Validators.maxLength(30)]],
      deduction1type: [''],
      deduction1percentage: ['', [Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$'),
        Validators.max(100), Validators.required]],
      deduction2status: [''],
      deduction2label: ['', [Validators.required, Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'),
        Validators.maxLength(30)]],
      deduction2type: [''],
      deduction2percentage: ['', [Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$'),
        Validators.max(100), Validators.required]],
      addition1status: [''],
      addition1label: ['', [Validators.required, Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'),
        Validators.maxLength(30)]],
      addition1type: [''],
      addition1percentage: ['', [Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$'),
        Validators.max(100), Validators.required]],
      addition2status: [''],
      addition2label: ['', [Validators.required, Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'),
        Validators.maxLength(30)]],
      addition2type: [''],
      addition2percentage: ['', [Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$'),
        Validators.max(100), Validators.required]],
      addition3status: [''],
      addition3label: ['', [Validators.required, Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'),
        Validators.maxLength(30)]],
      addition3type: [''],
      addition3percentage: ['', [Validators.pattern('^(\\d{1,12}?[.]{0,1}?\\d{0,2}?)$'),
        Validators.max(100), Validators.required]],
    });
  }
  async fillSettingForm() {
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
          this.estimateSettingElements = response;
          this.changeCurrency(response.currency);
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
    if (this.settingForm.valid) {
      this.estimateSettingElements = this.settingForm.value;
      this.calcTotal();
      jQuery('#modalSetting').modal('hide');
      this.onAddCurrencySymbol();
    }
  }
  onCancelSetting() {
    this.settingForm.patchValue({
      currency: this.estimateSettingElements.currency,
      deduction1status: +this.estimateSettingElements.deduction1status === 1,
      deduction1label: this.estimateSettingElements.deduction1label,
      deduction1type: this.estimateSettingElements.deduction1type,
      deduction1percentage: this.estimateSettingElements.deduction1percentage,
      deduction2status: +this.estimateSettingElements.deduction2status === 1,
      deduction2label: this.estimateSettingElements.deduction2label,
      deduction2type: this.estimateSettingElements.deduction2type,
      deduction2percentage: this.estimateSettingElements.deduction2percentage,
      addition1status: +this.estimateSettingElements.addition1status === 1,
      addition1label: this.estimateSettingElements.addition1label,
      addition1type: this.estimateSettingElements.addition1type,
      addition1percentage: this.estimateSettingElements.addition1percentage,
      addition2status: +this.estimateSettingElements.addition2status === 1,
      addition2label: this.estimateSettingElements.addition2label,
      addition2type: this.estimateSettingElements.addition2type,
      addition2percentage: this.estimateSettingElements.addition2percentage,
      addition3status: +this.estimateSettingElements.addition3status === 1,
      addition3label: this.estimateSettingElements.addition3label,
      addition3type: this.estimateSettingElements.addition3type,
      addition3percentage: this.estimateSettingElements.addition3percentage
    });
    try {
      this.selectedCurrencyImage = environment.flagUrl +
          this.currency.find(({currencyCode}) => currencyCode === this.estimateSettingElements.currency).flag;
      this.selectedCurrencyCode = this.currency.find(
          ({currencyCode}) => currencyCode === this.estimateSettingElements.currency).currencyCode;
      this.selectedCurrencySymbol = this.currency.find(
          ({currencyCode}) => currencyCode === this.estimateSettingElements.currency).currencySymbol;
    } catch {
      console.log('this is catch');
      window.location.reload();
    }

  }
  onSettingCall() {
    jQuery('#modalSetting').modal('show');
  }
  onCreateRow(): FormGroup {
    return this.formBuilder.group({
      inx: '',
      id: '',
      estimate_id: '',
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
    this.s.at(index).patchValue({
      user_id: jCurrentUser['id'],
      inx: index
    });
    if (this.pageStatus === 'modify') {
      this.s.at(index).patchValue({
        estimate_id: this.id
      });
    }
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
    this.router.navigate(['/estimate/estimate-list']);
  }
  get f() { return this.fillForm.controls; }
  get q() { return this.fillFormRows.controls; }
  get s() { return this.fillFormRows.get('estimateRows') as FormArray; }
  get g() { return this.settingForm.controls; }
  onModify() {
    this.router.navigate(['/estimate/' + this.id + '/modify']);
  }
  onLoadCompanyDataSetUserId(event) {
    this.onLoadCompanyData(event);
    this.onSetUserId();
  }
  onSubmit() {
    this.rowTotalString = [];
    this.rowTotalNumber = [];
    this.invoiceSubTotal = '';
    this.invoiceSubTotalDigit = 0;
    this.invoiceTotal = '';
    this.invoiceTotalDigit = 0;
    if (this.pageStatus === 'new') {
      if (this.fillForm.valid && this.fillFormRows.valid && this.settingForm.valid) {
        this.subscription = this.estimateService.estimateCreate(this.fillForm.value).subscribe(
            (response) => {
              if (response['message'] === 'SUCCESS') {
                this.subscription = this. subscription = this.estimateService.getEstimateNumber(this.jUserID).subscribe(
                    (estimateID) => {
                      this.settingForm.get('estimate_id').setValue(estimateID['id']);
                      this.savedEstimateID = estimateID['id'];
                      for (let row = 0; row < this.s.length; row++) {
                        this.s.at(row).get('estimate_id').setValue(estimateID['id']);
                      }
                      for (const rowData of this.s.value) {
                        this.subscription = this.estimateRowsService.estimateRowCreate(rowData).subscribe(
                            () => {

                            }, () => {
                              this.submitMessage = 'Unexpected error occurred, may the estimate row(s) has not been saved';
                              this.submitMessageStatusFail = true;
                              setTimeout(() => {
                                this.submitMessageStatusFail = false;
                              }, 3000);
                            }
                        );
                      }
                      this.subscription = this.ecs.createEstimateCustomSetting(this.settingForm.value).subscribe(
                          () => {
                          }
                      );
                    }, () => {
                      this.submitMessage = 'Unexpected error occurred, may the estimate setting has not been saved';
                      this.submitMessageStatusFail = true;
                      setTimeout(() => {
                        this.submitMessageStatusFail = false;
                      }, 3000);
                    }
                );
                this.submitMessage = 'The estimate has been saved successfully';
                this.submitMessageStatusSuccess = true;
                setTimeout(() => {
                  this.submitMessageStatusSuccess = false;
                  this.router.navigate(['/estimate/' + this.savedEstimateID]);
                  this.onScrollTop();
                }, 3000);
              }
            }, () => {
              this.submitMessage = 'Unexpected error occurred, your estimate has not been saved';
              this.submitMessageStatusFail = true;
              setTimeout(() => {
                this.submitMessageStatusFail = false;
              }, 3000);
            }
        );
      } else {
        this.submitMessage = 'Fill all the mandatory fields, stared* fields are mandatory';
        this.submitMessageStatusFail = true;
        setTimeout(() => {
          this.submitMessageStatusFail = false;
        }, 3000);
      }
    } else {
      if (this.fillForm.valid && this.fillFormRows.valid && this.settingForm.valid) {
        const estimateIDJson = '{ "estimate_id" : "' + this.id + '" }';
        this.subscription = this.estimateRowsService.estimateRowsDelete(estimateIDJson).subscribe(
            () => {
              for (const rowData of this.s.value) {
                this.subscription = this.estimateRowsService.estimateRowCreate(rowData).subscribe(
                    () => {
                    }
                    , () => {
                      this.submitMessage = 'Unexpected error occurred, may the estimate row(s) has not been updated.';
                      this.submitMessageStatusFail = true;
                      setTimeout(() => {
                        this.submitMessageStatusFail = false;
                      }, 3000);
                    }
                );
              }
            }
            , () => {
              this.submitMessage = 'Unexpected error occurred, may the estimate row(s) has not been updated.';
              this.submitMessageStatusFail = true;
              setTimeout(() => {
                this.submitMessageStatusFail = false;
              }, 3000);
            }
        );

        this.estimateService.estimateUpdate(this.fillForm.value).subscribe(
            (response) => {
              if (response['message'] === 'SUCCESS') {
                this.ecs.updateEstimateCustomSetting(this.settingForm.value).subscribe(
                    (resSetting) => {
                      if (resSetting['message'] === 'SUCCESS') {
                        this.submitMessage = 'The estimate has been updated successfully';
                        this.submitMessageStatusSuccess = true;
                        setTimeout(() => {
                          this.submitMessageStatusSuccess = false;
                          this.router.navigate(['/estimate/' + this.id]);
                          this.onScrollTop();
                        }, 3000);
                      }
                    }
                    , () => {
                      this.submitMessage = 'The estimate has been updated, but its setting has not been updated.';
                      this.submitMessageStatusFail = true;
                      setTimeout(() => {
                        this.submitMessageStatusFail = false;
                        this.router.navigate(['/estimate/' + this.id]);
                        this.onScrollTop();
                      }, 3000);
                    }
                );
              }
            }
            , () => {
              this.submitMessage = 'Unexpected error occurred, your estimate has not been updated.';
              this.submitMessageStatusFail = true;
              setTimeout(() => {
                this.submitMessageStatusFail = false;
              }, 3000);
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
    try {
      this.companyInfo = this.companyList.find(company => company.id === companyID);
    } catch {
      console.log('this is catch');
      window.location.reload();
    }

    if (this.companyInfo.logo_link) {
      this.imgUrl = `${environment.imageUrl}` + this.companyInfo.logo_link;
      this.getBase64();
    } else {
      this.imgUrl = `${environment.imageDefault}`;
    }
  }
  onLoadCustomerData(customerID) {
    try {
      this.customerInfo = this.customerList.find(customer => customer.id === customerID);
    } catch {
      console.log('this is catch');
      window.location.reload();
    }

  }
  onAddCompany() {
    this.router.navigate(['/company/new']);
  }
  onAddCustomer() {
    this.router.navigate(['/customer/new']);
  }
  onRemoveLine(lineIndex) {
    this.estimateRows = this.fillFormRows.get('estimateRows') as FormArray;
    this.rowTotalString.splice(lineIndex, 1);
    this.rowTotalNumber.splice(lineIndex, 1);
    this.estimateRows.removeAt(lineIndex);
    this.calcSubTotal();
    this.calcTotal();
  }
  onAddLine() {
    this.estimateRows = this.fillFormRows.get('estimateRows') as FormArray;
    this.estimateRows.push(this.onCreateRow());
  }
  changeCurrency(currencySelected) {
    try {
      this.selectedCurrencyImage = environment.flagUrl +
          this.currency.find(({currencyCode}) => currencyCode === currencySelected).flag;
      this.selectedCurrencyCode = this.currency.find(({currencyCode}) => currencyCode === currencySelected).currencyCode;
      this.selectedCurrencySymbol = this.currency.find(({currencyCode}) =>
          currencyCode === currencySelected).currencySymbol;
    } catch {
      console.log('this is catch');
      window.location.reload();
    }
  }
  onScrollTop() {
    const scrollToTop = window.setInterval(() => {
      const pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
  getDocumentDefinition() {
    return {
      content: [
        {columns: [
            [{
              text: 'Estimate',
              bold: true,
              fontSize: 20,
              alignment: 'left',
              margin: [0, 15, 0, 15]
            }],
            [
              this.getCompanyLogo()
            ]
          ]
        },
        {columns: [
            {
              width: '70%',
              text: this.companyInfo.name,
              margin: [ 0, 5, 0, 2 ]
            },
            {
              width: '30%',
              text: 'Date: ' + this.estimateInfo.date,
              margin: [ 0, 5, 0, 2 ]
            }
          ]},
        {columns: [
            {
              width: '70%',
              text: this.companyInfo.address,
              margin: [ 0, 0, 0, 2 ]
            },
            {
              width: '30%',
              text: 'Estimate No.: ' + this.estimateInfo.estimate_number,
              margin: [ 0, 0, 0, 2 ]
            }
          ]
        },
        {columns: [
            {
              text: this.companyInfo.website,
              margin: [ 0, 0, 0, 2 ]
            }
          ]},
        {columns: [
            {
              text: this.companyInfo.email,
              margin: [ 0, 0, 0, 2 ]
            }
          ]},
        {columns: [
            this.getBusinessNo()
          ]},
        {columns: [
            this.getGSTNo()
          ]},
        {columns: [
            [{
              text: 'Bill to:',
              bold: 'true',
              margin: [0, 10, 0, 5],
              decoration: 'underline'
            },
              {
                text: this.customerInfo.name,
                margin: [ 0, 0, 0, 2 ]
              },
              {
                text: this.customerInfo.address,
                margin: [ 0, 0, 0, 2 ]
              },
              {
                text: this.customerInfo.phone,
                margin: [ 0, 0, 0, 2 ]
              },
              {
                text: this.customerInfo.email,
                margin: [ 0, 0, 0, 5 ]
              }]
          ]},
        this.getInvoiceData(),
        {
          columns: [
            {
              text: 'Notes',
              margin: [0, 5, 0, 2],
              bold: 'true',
              decoration: 'underline'
            }

          ]
        },
        {    columns: [
            {
              text: this.estimateInfo.note,
              alignment: 'justify'

            }
          ]
        }
      ],
      info: {
        title: this.estimateInfo.estimate_number + '_Estimate',
        author: this.companyInfo.name,
        subject: 'INVOICE',
        creator: 'Easy Invoice Maker www.einvoicemaker.com',
        producer: 'Easy Invoice Maker www.einvoicemaker.com',
        keywords: 'INVOICE, ONLINE INVOICE',
      },
      styles: {
        tableHeader: {
          alignment: 'center',
          bold: 'true',
          fillColor: '#e6e6e6'
        }

      }
    };
  }
  getInvoiceData() {
    const row = [];

    for (let count = 0; count < this.s.length; count++) {
      row.push(
          [{
            text: this.s.at(count).get('description').value +  '\n' + this.s.at(count).get('comment').value,
            fillColor: (count % 2 !== 0) ? '#D0DCF8' : null
          },
            {
              text: this.s.at(count).get('unit_price').value + ' ' +  this.s.at(count).get('unit_measure').value,
              fillColor: (count % 2 !== 0) ? '#D0DCF8' : null,
              alignment: 'center'
            },
            {
              text: this.s.at(count).get('quantity').value,
              fillColor: (count % 2 !== 0) ? '#D0DCF8' : null,
              alignment: 'center'
            },
            {
              text: this.rowTotalString[count],
              fillColor: (count % 2 !== 0) ? '#D0DCF8' : null,
              alignment: 'right'
            }]
      );
    }
    return {
      table: {
        widths: ['50%', '15%', '15%', '20%'],
        body: [
          [
            {
              text: 'Description/Comment',
              style: 'tableHeader'
            },
            {
              text: 'Unit Price',
              style: 'tableHeader'
            },
            {
              text: 'Qty',
              style: 'tableHeader'
            },
            {
              text: 'Total',
              style: 'tableHeader'
            },
          ],
          ...row
          , [
            {
              text: 'Sub-Total',
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: this.invoiceSubTotal,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: +this.estimateSettingElements.deduction1status === 1 ?
                  this.estimateSettingElements.deduction1label : null,
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: +this.estimateSettingElements.deduction1status === 1 ?
                  this.f.deduction1.value : null,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: +this.estimateSettingElements.deduction2status === 1 ?
                  this.estimateSettingElements.deduction2label : null,
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: +this.estimateSettingElements.deduction2status === 1 ?
                  this.f.deduction2.value : null,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: +this.estimateSettingElements.addition1status === 1 ?
                  this.estimateSettingElements.addition1label : null,
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: +this.estimateSettingElements.addition1status === 1 ?
                  this.f.addition1.value : null,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: +this.estimateSettingElements.addition2status === 1 ?
                  this.estimateSettingElements.addition2label : null,
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: +this.estimateSettingElements.addition2status === 1 ?
                  this.f.addition2.value : null,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: +this.estimateSettingElements.addition3status === 1 ?
                  this.estimateSettingElements.addition3label : null,
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, false],
            },
            '',
            '',
            {
              text: +this.estimateSettingElements.addition3status === 1 ?
                  this.f.addition3.value : null,
              alignment: 'right',
              border: [true, false, true, false],
            }
          ],
          [
            {
              text: 'Total',
              colSpan: '3',
              alignment: 'right',
              border: [true, false, true, true],
            },
            '',
            '',
            {
              text: this.invoiceTotal,
              alignment: 'right',
              border: [true, false, true, true],
            }
          ]
        ]
      }
    };
  }
  getBusinessNo() {
    if (this.companyInfo.business_no) {
      return {
        text: 'Business No.: ' + this.companyInfo.business_no,
        margin: [0, 0, 0, 2]
      };
    }
  }
  getGSTNo() {
    if (this.companyInfo.gst_no) {
      return {
        text: 'GST No.: ' + this.companyInfo.gst_no,
        margin: [0, 0, 0, 2]
      };
    }
  }
  getCompanyLogo() {
    if (this.companyInfo.logo_link) {
      return {
        image: this.imgBase64,
        width: 75,
        alignment : 'right'
      };
    } else {
      return null;
    }
  }
  async getBase64() {
    if (this.companyInfo.logo_link) {
      const res = await fetch(`${environment.imageUrl}` + this.companyInfo.logo_link);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        this.imgBase64 = reader.result as string;
      };
      reader.onerror = (error) => {
        console.log('Error: ', error);
      };
    }
  }
  onPrintInvoice() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).print();
  }
  onOpenInvoice() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }
  onDownloadInvoice() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).download(this.estimateInfo.estimate_number + '_ESTIMATE');
  }
  onSetPercentage(control, value) {
    if (value.target.value === 'F') {
      this.settingForm.get(control).setValue(0);
    } else {
      this.settingForm.get(control).setValue(this.estimateSettingElements[control]);
    }
  }

}
