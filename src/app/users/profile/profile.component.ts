import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UserService} from '../../shared/services/user.service';
import {ToolsService} from '../../shared/services/tools.service';
import {UserModel} from '../../shared/models/user.model';
import {CountryModel} from '../../shared/models/country.model';
import {CountryService} from '../../shared/services/country.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  // styleUrls: ['../../../styles.css']
})
export class ProfileComponent implements OnInit {
  pageTitle = 'Profile';
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  profileForm: FormGroup;
  subscription: Subscription;
  countryList: CountryModel[] = [];
  selectedCountryImage = '';
  processing = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private userService: UserService,
              private toolsService: ToolsService, private countryService: CountryService) { }

  ngOnInit() {
    this.initForm();
    this.fillForm();
    this.countryList = this.countryService.getCountry();
  }
  initForm() {
    this.profileForm = this.formBuilder.group({
      first_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\ *\\-*]*$'),
          Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z\\ *\\-*]*$'),
          Validators.maxLength(50)]],
      email: '',
      address1: ['', [Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'), Validators.maxLength(100)]],
      address2: ['', [Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'), Validators.maxLength(100)]],
      city: ['', [Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'), Validators.maxLength(50)]],
      province: ['', [Validators.pattern('^(\\w*\\ *\\.*\\-*)*$'), Validators.maxLength(50)]],
      country: [''],
      postal_code: ['', [Validators.pattern('^(\\w*\\ *\\.*\\-*\\\\*)*$'), Validators.maxLength(10)]],
      contact_number: ['', [Validators.pattern('(^\\+[0-9]{2})([0-9]{8,13}$)')]],
      id: ''
    });
  }
  fillForm() {
    let currentUserJson = this.toolsService.getUserID();
    currentUserJson = '{ "id" : "' + currentUserJson['id'] + '" }';
    this.subscription = this.userService.getUserByID(currentUserJson).subscribe(
        (response: UserModel) => {
          this.profileForm.patchValue({
            id: response.id,
            first_name: response.first_name,
            last_name: response.last_name,
            email: response.email,
            address1: response.address1,
            address2: response.address2,
            city: response.city,
            province: response.province,
            country: response.country,
            postal_code: response.postal_code,
            contact_number: response.contact_number
          });
          if (response.country) {
            this.selectedCountryImage = environment.flagUrl +
                this.countryList.find(({countryCode}) => countryCode === response.country).flag;
          }
        }
    );
  }
  onBack() {
    this.router.navigate(['/dashboard']);
  }
  onSubmit() {
    if (this.profileForm.valid) {
      this.processing = true;
      this.userService.userUpdate(this.profileForm.value).subscribe(
          () => {
              this.submitMessageStatusSuccess = true;
              this.submitMessage = 'Your profile has been successfully updated.';
              this.processing = false;
              // setTimeout(() => {
              //   this.submitMessageStatusSuccess = false;
              // }, 5000);
            }, () => {
            this.submitMessage = 'Unexpected error, contact User Support.';
            this.submitMessageStatusFail = true;
            this.processing = false;
            // setTimeout(() => {
            //   this.submitMessageStatusFail = false;
            // }, 5000);
          });

    } else {
      this.toolsService.markFormGroupTouched(this.profileForm);
    }
  }
  changeCountry(selectedCountry) {
    try {
      if (selectedCountry) {
        this.selectedCountryImage = environment.flagUrl +
            this.countryList.find(({countryCode}) => countryCode === selectedCountry).flag;
      }
    } catch {
      window.location.reload();
    }
  }
  get f() { return this.profileForm.controls; }

}
