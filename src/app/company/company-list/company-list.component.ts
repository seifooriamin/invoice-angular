import {AfterViewInit, ChangeDetectorRef, Component, DoCheck, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { MdbTablePaginationComponent, MdbTableDirective } from 'node_modules/angular-bootstrap-md';
import {CompanyService} from '../../shared/services/company.service';
import {CompanyModel} from '../../shared/models/company.model';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  data: CompanyModel[];
  currentUser: any;
  companyName = '';
  searchText = '';
  companyIndex = '';
  companyId = '';
  deleteMessageStatus = false;
  deleteMessageText = '';
  subscription: Subscription;
  constructor(private cdRef: ChangeDetectorRef, private companyService: CompanyService, private router: Router) { }
  @HostListener('input') oninput() { this.searchItems(); }

  ngOnInit() {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
      this.subscription = this.companyService.companyReadByUser(userId).subscribe(
          (records: Array<CompanyModel>) => {
              this.data = records['records'];
              for (let idata of records['records']) {
                  this.elements.push({id: idata.id, name: idata.name, phone: idata.phone, email: idata.email});
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
  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }

    searchItems() {
        const prev = this.mdbTable.getDataSource();
        if (!this.searchText) {
            this.mdbTable.setDataSource(this.previous);
            this.elements = this.mdbTable.getDataSource();
        }
        if (this.searchText) {
            this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['name',
                'phone', 'email']);
            this.mdbTable.setDataSource(prev);
        }
  }
  ngAfterViewInit() {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);

    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }

  onAddNew() {
    this.router.navigate(['company/new']);
  }

  onModalShow(company, cindex, cid) {
      this.companyName = company;
      this.companyIndex = cindex;
      this.companyId = cid;
      jQuery('#modalMessage').modal('show');
  }

  onDeleteCompany(index, id, name) {
      jQuery('#modalMessage').modal('hide');
      this.mdbTable.removeRow(index);
      // this.elements.splice(index, 1);
      const idJson = '{ "id" : "' + id + '" }';
      this.companyService.companyDelete(idJson).subscribe(
          (response) => {
              if (response['message'] === 'SUCCESS') {
                  this.deleteMessageText = name + ' has been deleted successfully';
                  this.deleteMessageStatus = true;
                  setTimeout(() => {
                      this.deleteMessageStatus = false;
                  }, 2000);
              }
          }, (e) => {
              this.deleteMessageText = 'Due to technical issue ' + name + ' has not been deleted.';
              this.deleteMessageStatus = true;
              setTimeout(() => {
                  this.deleteMessageStatus = false;
              }, 2000);
          }
      );
  }


}
