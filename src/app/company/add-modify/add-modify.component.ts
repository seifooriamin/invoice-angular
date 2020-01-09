import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../../shared/services/company.service';
import {ToolsService} from '../../shared/services/tools.service';



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


  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, private http: HttpClient,
              private toolsService: ToolsService) {
  }

  ngOnInit() {
    this.fillForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),
        Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      address: ['', [Validators.required, Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      phone: ['', [Validators.pattern('(^\\+[0-9]{2})([0-9]{8,13}$)'),
          Validators.maxLength(14)]],
      business_no: ['', [Validators.maxLength(20), Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*)*$')]],
      gst_no: ['', [Validators.maxLength(20), Validators.pattern('^(\\w*\\.*\\ *\\-*\\_*\\\\*\\/*)*$')]],
      website: ['', Validators.maxLength(50)],
      email: ['', [Validators.email, Validators.maxLength(50)]],
      logoFile: [''],
      user_id: ['', Validators.required]
    });
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
      const jCurrentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.fillForm.patchValue({
          user_id: jCurrentUser['id']
      });
  }

  onSubmit() {
      if (this.fillForm.valid) {
          this.companyService.companyCreate(this.fileToUpload, this.fillForm.value).subscribe(
              (response) => {
                  if (response['message'] === 'SIU' || response['message'] === 'SIE') {
                      this.submitMessageStatusSuccess = true;
                      this.submitMessage = 'Company has been successfully registered';
                      this.fillForm.reset();
                      this.imageCleanUp();
                  } else {
                      if (response['message'] === 'SINU') {
                          this.submitMessage = 'Company has been successfully registered, the logo has not been uploaded';
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

  }

}
