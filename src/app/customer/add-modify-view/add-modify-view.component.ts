import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ToolsService} from '../../shared/services/tools.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CustomerService} from '../../shared/services/customer.service';
import {CustomerModel} from '../../shared/models/customer.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-add-modify-view',
  templateUrl: './add-modify-view.component.html',
  styleUrls: ['../../../my-style.css']
})
export class AddModifyViewComponent implements OnInit, OnDestroy {
  fillForm: FormGroup;
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  id = 0;
  customerData: CustomerModel;
  pageStatus = 'new';
  pageTitle = 'New Company Registration';
  subscription: Subscription;
  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private http: HttpClient,
              private toolsService: ToolsService, private router: Router, private route: ActivatedRoute) { }

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
        this.pageTitle = 'Modify Customer Information';
      } else {
        this.pageStatus = 'view';
        this.pageTitle = 'View Customer Information';
      }
    }
    this.initializeForm();
    if (this.pageStatus === 'view' || this.pageStatus === 'modify') {
      this.fillFormData();
    }
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  initializeForm() {
    this.fillForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50),
        Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      address: ['', [Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      phone: ['', [Validators.pattern('(^\\+[0-9]{2})([0-9]{8,13}$)'),
        Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.maxLength(50)]],
      user_id: ['', Validators.required],
      id: ['']
    });
  }
  fillFormData() {
    this.subscription = this.customerService.customerByID(this.id).subscribe(
        (customer: CustomerModel) => {
          this.customerData = customer;
          this.id = customer.id;
          this.fillForm.patchValue({
            user_id: customer.user_id,
            name: customer.name,
            address: customer.address,
            phone: customer.phone,
            email: customer.email,
            id: customer.id
          });
        }
    );
  }
  get f() { return this.fillForm.controls; }
  onSetUserId() {
    const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.fillForm.patchValue({
      user_id: jCurrentUser['id']
    });
  }
  onBack() {
    this.router.navigate(['/customer/customer-list']);
  }
  onModify() {
    this.router.navigate(['/customer/' + this.id + '/modify']);
  }
  onSubmit() {
    if (this.pageStatus === 'new') {
      if (this.fillForm.valid) {
        this.customerService.customerCreate(this.fillForm.value).subscribe(
            (response) => {
              if (response['message'] === 'SUCCESS') {
                this.submitMessageStatusSuccess = true;
                this.submitMessage = 'The customer has been successfully registered';
                this.fillForm.reset();

              } else {
                  if (response['message'] === 'FAIL') {
                    this.submitMessageStatusFail = true;
                    this.submitMessage = 'Due to technical issue the customer has not been registered';
                  }
                }
              }
        );
      } else {
        this.submitMessage = 'Fill all the mandatory fields';
        this.submitMessageStatusFail = true;
        setTimeout(() => {
          this.submitMessageStatusFail = false;
        }, 3000);
      }
    } else {
      if (this.fillForm.valid) {
        this.customerService.customerUpdate(this.fillForm.value).subscribe(
            (response) => {
              if (response['message'] === 'SUCCESS') {
                this.submitMessageStatusSuccess = true;
                this.submitMessage = 'The customer information has been successfully updated';
                this.router.navigate(['/customer/' + this.id]);
              } else {
                  if (response['message'] === 'FAIL') {
                    this.submitMessageStatusFail = true;
                    this.submitMessage = 'Due to technical issue the customer information has not been updated';
                  }
                }
              }
        );
      } else {
        this.submitMessage = 'Fill all the mandatory fields';
        this.submitMessageStatusFail = true;
        setTimeout(() => {
          this.submitMessageStatusFail = false;
        }, 3000);
      }

    }
  }


}
