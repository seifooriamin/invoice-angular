import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent} from 'node_modules/angular-bootstrap-md';
import {CompanyModel} from '../../shared/models/company.model';
import {Router} from '@angular/router';
import {CustomerService} from '../../shared/services/customer.service';
import {CustomerModel} from '../../shared/models/customer.model';
import {Subscription} from 'rxjs';
declare var jQuery: any;
@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['../../../my-style.css']
})
export class CustomerListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  data: CompanyModel[];
  currentUser: any;
  subscribe: Subscription;
  searchText = '';
  customerName = '';
  customerIndex = '';
  customerId = '';
  deleteMessageStatus = false;
  deleteMessageText = '';
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private customerService: CustomerService) { }
  @HostListener('input') oninput() { this.searchItems(); }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscribe = this.customerService.customerReadByUser(userId).subscribe(
        (records: Array<CustomerModel>) => {
          this.data = records['records'];
          for (let idata of records['records']) {
            this.elements.push({id: idata.id, name: idata.name , address: idata.address, phone: idata.phone, email: idata.email});
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
        this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['name',
          'address', 'phone', 'email']);
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

  onModalShow(company, cindex, cid) {
    this.customerName = company;
    this.customerIndex = cindex;
    this.customerId = cid;
    jQuery('#modalMessage').modal('show');
  }

  onDeleteCustomer(index, id, name) {
    jQuery('#modalMessage').modal('hide');
    this.mdbTable.removeRow(index);
    const idJson = '{ "id" : "' + id + '" }';
    this.customerService.customerDelete(idJson).subscribe(
        (response) => {
          if (response['message'] === 'SUCCESS') {
            this.deleteMessageText = name + 'has been deleted successfully';
            this.deleteMessageStatus = true;
            setTimeout(() => {
              this.deleteMessageStatus = false;
            }, 2000);
          }
        }, (e) => {
          this.deleteMessageText = 'Due to technical issue' + name + 'has not been deleted.';
          this.deleteMessageStatus = true;
          setTimeout(() => {
            this.deleteMessageStatus = false;
          }, 2000);
        }
    );
  }

  onAddNew() {
    this.router.navigate(['customer/new']);
  }

}
