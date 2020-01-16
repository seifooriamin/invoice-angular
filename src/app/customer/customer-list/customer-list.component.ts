import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent} from 'angular-bootstrap-md';
import {CompanyModel} from '../../shared/models/company.model';
import {Router} from '@angular/router';
import {CustomerService} from '../../shared/services/customer.service';
import {CustomerModel} from '../../shared/models/customer.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
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
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private customerService: CustomerService) { }
  @HostListener('input') oninput() { this.searchItems(); }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscribe = this.customerService.customerReadByUser(userId).subscribe(
        (records: Array<CustomerModel>) => {
          this.data = records['records'];
          for (let idata of records['records']) {
            this.elements.push({id: idata.id, name: idata.name , address: idata.address});
          }
          this.mdbTable.setDataSource(this.elements);
          this.elements = this.mdbTable.getDataSource();
          this.previous = this.mdbTable.getDataSource();
        },
        (e) => {
          console.log('error inform the developer');
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
          'address']);
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

  onAddNew() {

  }

}
