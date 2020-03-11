import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent} from 'node_modules/angular-bootstrap-md';
import {Subscription} from 'rxjs';
import {InvoiceModel} from '../../shared/models/invoice.model';
import {Router} from '@angular/router';
import {InvoiceService} from '../../shared/services/invoice.service';
import {InvoiceRowsService} from '../../shared/services/invoice-rows.service';
import {InvoiceCustomSettingService} from '../../shared/services/invoice-custom-setting.service';
declare var jQuery: any;
@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['../../../my-style.css']
})
export class InvoiceListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  // data: InvoiceModel[];
  currentUser: any;
  subscribe: Subscription;
  searchText = '';
  invoiceNumber = '';
  invoiceIndex = '';
  invoiceId = '';
  deleteMessageStatus = false;
  deleteMessageText = '';
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private invoiceService: InvoiceService,
              private invoiceRowsService: InvoiceRowsService, private ics: InvoiceCustomSettingService) { }
  @HostListener('input') oninput() { this.searchItems(); }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscribe = this.invoiceService.invoiceReadByUser(userId).subscribe(
        (records: Array<InvoiceModel>) => {
          // this.data = records['records'];
          for (const idata of records['records']) {
            this.elements.push({id: idata.id, invoice_number: idata.invoice_number,
              date: idata.date, customer_name: idata.customer_name, company_name: idata.company_name,
              total: idata.total, year: idata.year});
          }
          this.mdbTable.setDataSource(this.elements);
          this.elements = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
        }, (e) => {
          this.deleteMessageText = 'No record found';
          this.deleteMessageStatus = true;
          setTimeout(() => {
            this.deleteMessageStatus = false;
          }, 2000);
        }
    );
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['invoice_number',
        'data', 'customer_name', 'company_name', 'total', 'year' ]);
      this.mdbTable.setDataSource(prev);
    }
  }
  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
  onModalShow(invoiceNumber, invoiceIndex, invoiceID) {
    this.invoiceNumber = invoiceNumber;
    this.invoiceIndex = invoiceIndex;
    this.invoiceId = invoiceID;
    jQuery('#modalMessage').modal('show');
  }
  onDeleteInvoice(index, id, invoiceNumber) {
    jQuery('#modalMessage').modal('hide');
    this.mdbTable.removeRow(index);
    const idJson = '{ "id" : "' + id + '" }';
    const invoiceIDJson = '{ "invoice_id" : "' + id + '" }';
    this.subscribe = this.invoiceService.invoiceDelete(idJson).subscribe(
        (response) => {
          if (response['message'] === 'SUCCESS') {
              this.subscribe = this.invoiceRowsService.invoiceRowsDelete(invoiceIDJson).subscribe(
                  (responseRows) => {
                      if (responseRows['message'] === 'SUCCESS') {
                          this.deleteMessageText = 'Invoice #' + invoiceNumber + ' has been deleted successfully';
                          this.deleteMessageStatus = true;
                          setTimeout(() => {
                              this.deleteMessageStatus = false;
                          }, 2000);
                      }
                  }, (e) => {
                      this.deleteMessageText = 'Invoice #' + invoiceNumber + ' has been deleted successfully, but some related' +
                          'related records have not been deleted yet, contact ADMINISTRATOR';
                      this.deleteMessageStatus = true;
                      setTimeout(() => {
                          this.deleteMessageStatus = false;
                      }, 2000);
                  }
              );
              this.ics.deleteInvoiceCustomSetting(invoiceIDJson).subscribe(
                  (delResponse) => {

                  }, () => {
                      this.deleteMessageText = 'Invoice #' + invoiceNumber + ' setting record has not been deleted';
                      this.deleteMessageStatus = true;
                      setTimeout(() => {
                          this.deleteMessageStatus = false;
                      }, 2000);
                  }
              );
          }
        }, (e) => {
          this.deleteMessageText = 'Due to technical issue invoice #' + invoiceNumber + ' has not been deleted.';
          this.deleteMessageStatus = true;
          setTimeout(() => {
            this.deleteMessageStatus = false;
          }, 2000);
        }
    );
  }
  onAddNew() {
    this.router.navigate(['invoice/new']);
  }
}
