import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../../shared/services/company.service';
import {ToolsService} from '../../shared/services/tools.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CompanyModel} from '../../shared/models/company.model';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';



@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  // styleUrls: ['../../../styles.css']
})
export class AddModifyComponent implements OnInit, OnDestroy {
  fillForm: FormGroup;
  previewUrl: any = null;
  fileToUpload: File = null;
  imageHint = false;
  submitMessageStatusFail = false;
  submitMessageStatusSuccess = false;
  submitMessage = '';
  id = 0;
  companyData: CompanyModel;
  pageStatus = 'new';
  pageTitle = 'New Company Registration';
  subscription: Subscription;
  logoStatus = false;
  processing = false;
  userID: number;


  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, private http: HttpClient,
              private toolsService: ToolsService, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.route.params.subscribe(
          (params: Params) => {
              this.id = params.id;
          }
      );
    if (this.id) {
        this.userID = this.toolsService.getUserID()['id'];
        const url = this.router.url;
        if (url.slice(-6) === 'modify') {
            this.pageStatus = 'modify';
            this.pageTitle = 'Modify Company Information';
        } else {
            this.pageStatus = 'view';
            this.pageTitle = 'View Company Information';
        }
    }
    this.initializeFormNew();
    if (this.pageStatus === 'view' || this.pageStatus === 'modify') {
        this.fillFormData();
    }

  }
  ngOnDestroy(): void {
      if (this.subscription) {
          this.subscription.unsubscribe();
      }
  }
  initializeFormNew() {
      this.fillForm = this.formBuilder.group({
          name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40),
              Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
          address: ['', [Validators.required, Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
          phone: ['', [Validators.pattern('(^\\+[0-9]{2})([0-9]{8,13}$)'),
              Validators.maxLength(14)]],
          business_no: ['', [Validators.maxLength(20), Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*)*$')]],
          gst_no: ['', [Validators.maxLength(20), Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*)*$')]],
          website: ['', Validators.maxLength(50)],
          email: ['', [Validators.email, Validators.maxLength(50)]],
          logoFile: [''],
          user_id: ['', Validators.required],
          id: ['']
      });
  }
  fillFormData() {
        this.subscription = this.companyService.companyByID(this.id, this.userID).subscribe(
            (company: CompanyModel) => {
                if (company.id) {
                    this.companyData = company;
                    this.id = company.id;
                    this.fillForm.patchValue({
                        user_id: company.user_id,
                        name: company.name,
                        address: company.address,
                        phone: company.phone,
                        business_no: company.business_no,
                        gst_no: company.gst_no,
                        website: company.website,
                        email: company.email,
                        id: company.id
                    });
                    if (company.logo_link) {
                        this.previewUrl = `${environment.imageUrl}` + company.logo_link;
                        this.getFile(`${environment.imageUrl}` + company.logo_link, company.logo_link);
                        this.logoStatus = true;
                    }
                } else {
                    this.router.navigate(['company/company-list']);
                }
            }, () => {
            }
        );
    }
  handleFileInput(files: FileList) {
      if ((files.item(0)) != null) {
          this.fileToUpload = files.item(0);
          if (this.toolsService.imageAccept(this.fileToUpload.type) && this.toolsService.imageSize(this.fileToUpload.size)) {
              this.imageHint = false;
              this.logoStatus = true;
              this.preview();
          } else {
              this.imageHint = true;
              this.imageCleanUp();
          }
      } else {
          this.imageCleanUp();
      }

    }
  imageCleanUp() {
        this.fileToUpload = null;
        this.previewUrl = null;
        this.logoStatus = false;
        this.fillForm.patchValue({
           logoFile: null
        });
    }
  preview() {
        // Show preview
        const mimeType = this.fileToUpload.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.fileToUpload);
        reader.onload = () => {
            this.previewUrl = reader.result;
        };
    }
  get f() { return this.fillForm.controls; }
  onSetUserId() {
      const jCurrentUser = this.toolsService.getUserID();
      this.fillForm.patchValue({
          user_id: jCurrentUser['id']
      });
  }
  onBack() {
      this.router.navigate(['/company/company-list']);
  }
  onModify() {
      this.router.navigate(['/company/' + this.id + '/modify']);
  }
  onSubmit() {
      if (this.fillForm.valid) {
        this.submitMessageStatusSuccess = false;
        this.submitMessageStatusFail = false;
        if (this.pageStatus === 'new') {
              this.processing = true;
              this.companyService.companyCreate(this.fileToUpload, this.fillForm.value).subscribe(
                  (response) => {
                      if (response['message'] === 'SIU' || response['message'] === 'SIE') {
                          this.submitMessageStatusSuccess = true;
                          this.submitMessage = 'The company has been successfully registered.';
                          this.fillForm.reset();
                          this.imageCleanUp();
                          this.processing = false;
                      } else {
                          if (response['message'] === 'SINU') {
                              this.submitMessage = 'The company has been successfully registered; the logo has not been uploaded.';
                              this.fillForm.reset();
                              this.imageCleanUp();
                              this.processing = false;
                          } else {
                              if (response['message'] === 'SINV') {
                                  this.submitMessageStatusFail = true;
                                  this.submitMessage = 'The company has been successfully registered; the logo file was not valid.';
                                  this.fillForm.reset();
                                  this.imageCleanUp();
                                  this.processing = false;
                              }
                          }
                      }
                  }, () => {
                      this.submitMessageStatusFail = true;
                      this.submitMessage = 'Unexpected error, contact User Support.';
                      this.processing = false;
                  }
              );
          } else {
              this.processing = true;
              this.companyService.companyUpdate(this.fileToUpload, this.fillForm.value).subscribe(
                  (response) => {
                      if (response['message'] === 'SIU' || response['message'] === 'SIE') {
                          this.submitMessageStatusSuccess = true;
                          this.submitMessage = 'The company information has been successfully updated.';
                          this.processing = false;
                          this.router.navigate(['/company/' + this.id]);
                      } else {
                          if (response['message'] === 'SINU') {
                              this.submitMessage = 'The company information has been successfully updated,' +
                                  ' but the logo has not been uploaded.';
                              this.submitMessageStatusFail = true;
                              this.processing = false;
                              this.router.navigate(['/company/' + this.id]);

                          } else {
                              if (response['message'] === 'SINV') {
                                  this.submitMessageStatusFail = true;
                                  this.submitMessage = 'The company information has been successfully updated;' +
                                      ' the logo file was not valid.';
                                  this.processing = false;
                                  this.router.navigate(['/company/' + this.id]);
                              }
                          }
                      }
                  }, () => {
                      this.submitMessageStatusFail = true;
                      this.submitMessage = 'Unexpected error, contact User Support.';
                      this.processing = false;
                  }
              );
          }
          } else {
          this.toolsService.markFormGroupTouched(this.fillForm);
      }


  }
  async getFile(url: string, fn: string) {
        const res = await fetch(url);
        const blob = await res.blob();
        this.fileToUpload = new File([blob], fn);
    }
  whiteSpace(formControl) {
      this.toolsService.whiteSpaceRemover(formControl);
  }
}
