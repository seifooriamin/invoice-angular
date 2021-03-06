import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CurrencyModel} from '../../shared/models/currency.model';
import {ToolsService} from '../../shared/services/tools.service';
import {InvoiceGeneralSettingService} from '../../shared/services/invoice-general-setting.service';
import {Subscription} from 'rxjs';
import {InvoiceGeneralSettingModel} from '../../shared/models/invoice-general-setting.model';
import {CurrencyService} from '../../shared/services/currency.service';
import {environment} from '../../../environments/environment';


@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  // styleUrls: ['../../../styles.css']
})
export class GeneralSettingComponent implements OnInit {
    settingForm: FormGroup;
    pageTitle = 'General Setting';
    selectedCurrencyCode = '';
    selectedCurrencyImage = '';
    selectedCurrencySymbol = '';
    submitMessageStatusFail = false;
    submitMessageStatusSuccess = false;
    submitMessage = '';
    currency: CurrencyModel[] = [];
    subscription: Subscription;
    typeOptions = [{typeCode: 'P', typeName: 'Percentage'}, {typeCode: 'F', typeName: 'Flat Rate'}];
    settingInfo: InvoiceGeneralSettingModel;
    processing = false;

    constructor(private router: Router, private formBuilder: FormBuilder, private toolsService: ToolsService,
                private igs: InvoiceGeneralSettingService, private currencyService: CurrencyService) {}
    ngOnInit() {
        this.initForm();
        this.fillForm();
        this.currency = this.currencyService.getCurrency();
    }
    initForm() {
        this.settingForm = this.formBuilder.group({
            id: [''],
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
            currency: ['']
        });
    }
    fillForm() {
        const userJson = this.toolsService.getUserIDJson();
        this.subscription = this.igs.readInvoiceSetting(userJson).subscribe(
            (response: InvoiceGeneralSettingModel) => {
                this.settingForm.patchValue(
                    {
                        id: response.id,
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
                        addition3percentage: response.addition2percentage,
                        currency: response.currency
                    });
                this.settingInfo = response;
                this.changeCurrency(response.currency);
            }
        );
    }
    onSetPercentage(control, value) {
        if (value.target.value === 'F') {
            this.settingForm.get(control).setValue(0);
        } else {
            this.settingForm.get(control).setValue(this.settingInfo[control]);
        }
    }
    onBack() {
        this.router.navigate(['/dashboard']);
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
    onSubmit() {
        if (this.settingForm.valid) {
            this.processing = true;
            this.igs.updateInvoiceSetting(this.settingForm.value).subscribe(
                (response) => {
                    if (response['message'] === 'SUCCESS') {
                        this.submitMessageStatusSuccess = true;
                        this.submitMessage = 'The General Setting has been successfully updated.';
                        this.processing = false;
                        // setTimeout(() => {
                        //     this.submitMessageStatusSuccess = false;
                        // }, 5000);
                    }}, () => {
                    this.submitMessage = 'Unexpected error, contact User Support.';
                    this.submitMessageStatusFail = true;
                    this.processing = false;
                    // setTimeout(() => {
                    //     this.submitMessageStatusFail = false;
                    // }, 5000);
                });

        } else {
            this.toolsService.markFormGroupTouched(this.settingForm);
        }
    }
    get f() { return this.settingForm.controls; }

}
