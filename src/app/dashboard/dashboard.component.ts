import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {CompanyModel} from '../shared/models/company.model';
import {CompanyService} from '../shared/services/company.service';
import {ToolsService} from '../shared/services/tools.service';
import {InvoiceService} from '../shared/services/invoice.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {StatisticsModel} from '../shared/models/statistics.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../my-style.css']
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  userName: string;
  subscription: Subscription;
  companyList: CompanyModel[];
  dashboardForm: FormGroup;
  jUserID: string;
  date = new Date();
  invoiceYear: string[] = [];
  amountData: number[] = [];
  countData: number[] = [];
  totalAmount = 0;
  totalNumber = 0;
  totalAmountStr = '';
  totalNumberStr = '';
  // Chart one variable
  public chartType = 'bar';
  public chartDatasetsAmount: Array<any> = [
    { data: this.amountData, label: 'Amount of Issued Invoice' }
  ];
  public chartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(0, 204, 0, 0.2)',
        'rgba(0, 204, 0, 0.2)',
        'rgba(0, 204, 0, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 206, 86, 0.2)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(0, 204, 0, 1)',
        'rgba(0, 204, 0, 1)',
        'rgba(0, 204, 0, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 2,
    }
  ];
  public chartOptions: any = {
    responsive: true
  };
  public chartDatasetsCount: Array<any> = [
    { data: this.countData, label: 'Number of Issued Invoice' }
  ];


  constructor(private companyService: CompanyService, private toolsService: ToolsService,
              private invoiceService: InvoiceService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userName = jCurrentUser.first_name;
    this.jUserID = this.toolsService.getUserIDJson();
    this.initForm();
    this.onLoadLists();
    this.dashboardForm.get('user_id').setValue(jCurrentUser.id);

  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {

  }
  initForm() {

    this.dashboardForm = this.formBuilder.group({
      user_id : [''],
      year: [''],
      company_id: [0]
    });
  }
  public chartClicked1(e: any): void { }
  public chartHovered1(e: any): void { }
  public chartClicked2(e: any): void { }
  public chartHovered2(e: any): void { }
  async onLoadLists() {
    this.subscription = this.companyService.companyReadByUser(this.jUserID).subscribe(
        (response) => {
          this.companyList = response['records'];
          this.companyList.push({id: 0, name: 'ALL', address: '', logo_link: '', email: '', business_no: '',
            gst_no: '', website: '', user_id: 0, phone: '', created: this.date, first_name: '', last_name: '', modified: this.date});
          this.subscription = this.invoiceService.invoiceYear(this.jUserID).subscribe(
              (responseYear) => {
                for (const rowsYear of responseYear['records']) {
                  this.invoiceYear.push(rowsYear.year);
                }
                this.dashboardForm.get('year').setValue(this.invoiceYear[0]);
                this.subscription = this.invoiceService.invoiceStatistics(this.dashboardForm.value).subscribe(
                    (responseChart: StatisticsModel) => {
                      let finder = false;
                      for (let monthSelector = 1; monthSelector <= 12; monthSelector++) {
                        finder = false;
                        for (const forData of responseChart['records']) {
                          if (+forData.month === monthSelector) {
                            this.amountData.push(forData.total);
                            this.totalAmount += +forData.total;
                            this.countData.push(forData.invoiceCount);
                            this.totalNumber += +forData.invoiceCount;
                            finder = true;
                          }
                        }
                        if (finder === false) {
                          this.amountData.push(0);
                          this.countData.push(0);
                        }
                      }
                      this.chartDatasetsAmount = [
                        { data: this.amountData, label: 'Amount of Issued Invoice' }
                      ];
                      this.chartDatasetsCount = [
                        { data: this.countData, label: 'Number of Issued Invoice' }
                      ];
                      this.totalAmountNumber();
                    }, () => {
                      this.chartDatasetsAmount = [
                        { data: this.amountData, label: 'Amount of Issued Invoice' }
                      ];
                      this.chartDatasetsCount = [
                        { data: this.countData, label: 'Number of Issued Invoice' }
                      ];
                      this.totalAmountNumber();
                    }
                );
              }, () => {}
          );
        }, () => {
        }
    );
  }
  async onSubmit() {
    this.amountData = [];
    this.countData = [];
    this.totalNumber = 0;
    this.totalAmount = 0;
    this.subscription = this.invoiceService.invoiceStatistics(this.dashboardForm.value).subscribe(
        (responseChart: StatisticsModel) => {
          let finder = false;
          for (let monthSelector = 1; monthSelector <= 12; monthSelector++) {
            finder = false;
            for (const forData of responseChart['records']) {
              if (+forData.month === monthSelector) {
                this.amountData.push(forData.total);
                this.countData.push(forData.invoiceCount);
                this.totalAmount += +forData.total;
                this.totalNumber += +forData.invoiceCount;
                finder = true;
              }
            }
            if (finder === false) {
              this.amountData.push(0);
              this.countData.push(0);
            }
          }
          this.chartDatasetsAmount = [
            { data: this.amountData, label: 'Amount of Issued Invoice' }
          ];
          this.chartDatasetsCount = [
            { data: this.countData, label: 'Number of Issued Invoice' }
          ];
          this.totalAmountNumber();
        }, () => {
          this.chartDatasetsAmount = [
            { data: this.amountData, label: 'Amount of Issued Invoice' }
          ];
          this.chartDatasetsCount = [
            { data: this.countData, label: 'Number of Issued Invoice' }
          ];
          this.totalAmountNumber();
        }
        );
  }
  totalAmountNumber() {
    this.totalAmount = this.toolsService.showNumberWithDecimal(this.totalAmount);
    this.totalAmountStr = this.toolsService.numberSeparator(this.totalAmount);
    this.totalNumberStr = this.toolsService.numberSeparator(this.totalNumber);
  }
}
