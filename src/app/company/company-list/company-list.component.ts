import {AfterViewInit, ChangeDetectorRef, Component, DoCheck, OnInit, ViewChild} from '@angular/core';
import { MdbTablePaginationComponent, MdbTableDirective } from 'node_modules/angular-bootstrap-md';
import {ActivatedRoute, Router} from '@angular/router';
import {CompanyService} from '../../shared/services/company.service';
import {CompanyModel} from '../../shared/models/company.model';

declare var jQuery: any;

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  data: CompanyModel[];
  currentUser: any;
  companyName = '';
  companyIndex = '';
  companyId = '';
  deleteMessageStatus = false;
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private companyService: CompanyService) { }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    try {
        this.companyService.companyReadByUser(userId).subscribe(
            (records: Array<CompanyModel>) => {
                this.data = records['records'];
                for (let idata of records['records']) {
                    this.elements.push({id: idata.id, name: idata.name , phone: idata.phone, email: idata.email});
                }
                this.mdbTable.setDataSource(this.elements);
                this.elements = this.mdbTable.getDataSource();
                this.previous = this.mdbTable.getDataSource();
            }
        );
    } catch (e) {
        console.log(e.toString());
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

  onDeleteCompany(index, id) {
      jQuery('#modalMessage').modal('hide');
      this.mdbTable.removeRow(index);
      // this.elements.splice(index, 1);
      const idJson = '{ "id" : "' + id + '" }';
      this.companyService.companyDelete(idJson).subscribe(
          (response) => {
              if (response['message'] === 'SUCCESS') {
                  this.deleteMessageStatus = true;
                  setTimeout(() => {
                      this.deleteMessageStatus = false;
                  }, 2000);
              }
          }
      );
  }


}
