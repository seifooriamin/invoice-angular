import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../../shared/services/company.service';
import {ToolsService} from '../../shared/services/tools.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CompanyModel} from '../../shared/models/company.model';



@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.css']
})
export class AddModifyComponent implements OnInit {
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


  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, private http: HttpClient,
              private toolsService: ToolsService, private router: Router, private route: ActivatedRoute) {
  }

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
        this.companyService.companyByID(this.id).subscribe(
            (company: CompanyModel) => {
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
                    this.previewUrl = 'http://localhost/invoice-angular/api/uploads/' + company.logo_link;
                }

            }
        );
    }
  handleFileInput(files: FileList) {
      if ((files.item(0)) != null) {
          this.fileToUpload = files.item(0);
          if (this.toolsService.imageAccept(this.fileToUpload.type) && this.toolsService.imageSize(this.fileToUpload.size)) {
              this.imageHint = false;
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
        reader.onload = (_event) => {
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
      if (this.pageStatus === 'new') {
          if (this.fillForm.valid) {
              this.companyService.companyCreate(this.fileToUpload, this.fillForm.value).subscribe(
                  (response) => {
                      if (response['message'] === 'SIU' || response['message'] === 'SIE') {
                          this.submitMessageStatusSuccess = true;
                          this.submitMessage = 'The company has been successfully registered';
                          this.fillForm.reset();
                          this.imageCleanUp();
                      } else {
                          if (response['message'] === 'SINU') {
                              this.submitMessage = 'The company has been successfully registered, the logo has not been uploaded';
                              this.fillForm.reset();
                              this.imageCleanUp();
                          } else {
                              if (response['message'] === 'FAIL') {
                                  this.submitMessageStatusFail = true;
                                  this.submitMessage = 'Due to technical issue the company has not been registered';
                              }
                          }
                      }
                  }
              );
          } else {
              this.submitMessageStatusFail = true;
              setTimeout(() => {
                  this.submitMessageStatusFail = false;
                  this.submitMessage = 'Fill all the mandatory fields';
              }, 3000);
          }
      } else {
          if (this.fillForm.valid) {
              this.companyService.companyUpdate(this.fileToUpload, this.fillForm.value).subscribe(
                  (response) => {
                      if (response['message'] === 'SIU' || response['message'] === 'SIE') {
                          this.submitMessageStatusSuccess = true;
                          this.submitMessage = 'The company information has been successfully updated';
                          // this.fillForm.reset();
                          // this.imageCleanUp();
                          this.router.navigate(['/company/' + this.id]);
                      } else {
                          if (response['message'] === 'SINU') {
                              this.submitMessage = 'The company information has been successfully updated, the logo has not been uploaded';
                              this.router.navigate(['/company/' + this.id]);
                              // this.fillForm.reset();
                              // this.imageCleanUp();
                          } else {
                              if (response['message'] === 'FAIL') {
                                  this.submitMessageStatusFail = true;
                                  this.submitMessage = 'Due to technical issue the company information has not been updated';
                              }
                          }
                      }
                  }
              );
          } else {
              this.submitMessageStatusFail = true;
              setTimeout(() => {
                  this.submitMessageStatusFail = false;
                  this.submitMessage = 'Fill all the mandatory fields';
              }, 3000);
          }

      }
  }

}
