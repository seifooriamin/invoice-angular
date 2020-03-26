import {AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MdbTableDirective, MdbTablePaginationComponent, TooltipConfig} from 'node_modules/angular-bootstrap-md';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {EstimateModel} from '../../shared/models/estimate.model';
import {EstimateService} from '../../shared/services/estimate.service';
import {EstimateRowsService} from '../../shared/services/estimate-rows.service';
import {EstimateCustomSettingService} from '../../shared/services/estimate-custom-setting.service';
import {ToolsService} from '../../shared/services/tools.service';
declare var jQuery: any;
@Component({
  selector: 'app-estimate-list',
  templateUrl: './estimate-list.component.html',
  styleUrls: ['../../../my-style.css']
})
export class EstimateListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  elements: any = [];
  previous: any = [];
  // data: EstimateModel[];
  currentUser: any;
  subscribe: Subscription;
  searchText = '';
  estimateNumber = '';
  estimateIndex = '';
  estimateId = '';
  deleteMessageStatus = false;
  deleteMessageText = '';
  constructor(private cdRef: ChangeDetectorRef, private router: Router, private estimateService: EstimateService,
              private toolsService: ToolsService) { }
  @HostListener('input') oninput() { this.searchItems(); }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId: string = '{ "user_id" : "' + this.currentUser['id'] + '" }';
    this.subscribe = this.estimateService.estimateReadByUser(userId).subscribe(
        (records: Array<EstimateModel>) => {
          // this.data = records['records'];
          for (const idata of records['records']) {
            this.elements.push({id: idata.id, estimate_number: idata.estimate_number,
              date: idata.date, customer_name: idata.customer_name, company_name: idata.company_name,
              total: this.toolsService.numberSeparator(this.toolsService.showNumberWithDecimal(idata.total))});
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
  ngAfterViewInit(): void {
    this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
    this.mdbTablePagination.calculateFirstItemIndex();
    this.mdbTablePagination.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
  ngOnDestroy(): void {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
  searchItems() {
    const prev = this.mdbTable.getDataSource();
    if (!this.searchText) {
      this.mdbTable.setDataSource(this.previous);
      this.elements = this.mdbTable.getDataSource();
    }
    if (this.searchText) {
      this.elements = this.mdbTable.searchLocalDataByMultipleFields(this.searchText, ['estimate_number',
        'data', 'customer_name', 'company_name', 'total' ]);
      this.mdbTable.setDataSource(prev);
    }
  }
  onModalShow(estimateNumber, estimateIndex, estimateID) {
    this.estimateNumber = estimateNumber;
    this.estimateIndex = estimateIndex;
    this.estimateId = estimateID;
    jQuery('#modalMessage').modal('show');
  }
  onDeleteInvoice(index, id, estimateNumber) {
    jQuery('#modalMessage').modal('hide');
    const idJson = '{ "id" : "' + id + '" }';
    this.subscribe = this.estimateService.estimateDelete(idJson).subscribe(
        () => {
            this.mdbTable.removeRow(index);
            this.deleteMessageText = 'Estimate #' + estimateNumber + ' has been deleted successfully.';
            this.deleteMessageStatus = true;
            setTimeout(() => {
              this.deleteMessageStatus = false;
            }, 5000);
        }, () => {
          this.deleteMessageText = 'Unexpected error, estimate #' + estimateNumber + ' has not been deleted; Contact User Support.';
          this.deleteMessageStatus = true;
          setTimeout(() => {
            this.deleteMessageStatus = false;
          }, 5000);
        }
    );
  }
  onAddNew() {
    this.router.navigate(['estimate/new']);
  }
}
