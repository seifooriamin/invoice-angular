import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../../shared/services/company.service';



@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.css']
})
export class AddModifyComponent implements OnInit {
  fillForm: FormGroup;

    fileData: File = null;
    previewUrl: any = null;
    fileUploadProgress: string = null;
    uploadedFilePath: string = null;
    fileToUpload: File = null;
    filepost: any;

  constructor(private formBuilder: FormBuilder, private companyService: CompanyService, private http: HttpClient) {
  }

  ngOnInit() {
    this.fillForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20),
        Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      address: ['', [Validators.required, Validators.pattern('(?=.*[a-zA-Z0-9]).{2,}')]],
      phone: ['', [Validators.pattern('(?=.*[0-9])'), Validators.maxLength(11)]],
      businessNo: ['', [Validators.maxLength(20), Validators.pattern('(?=.*[a-zA-z0-9])')]],
      gstNo: ['', [Validators.maxLength(20), Validators.pattern('(?=.*[a-zA-z0-9])')]],
      website: ['', Validators.maxLength(50)],
      email: ['', [Validators.email, Validators.maxLength(50)]],
      logoFile: [''],
    });
  }

    fileProgress(fileInput: any) {
        this.fileData = <File>fileInput.target.files[0];
        this.preview();
    }
    handleFileInput(files: FileList) {
        this.fileToUpload = files.item(0);
        console.log(this.fileToUpload.name);
    }

    preview() {
        // Show preview
        var mimeType = this.fileData.type;
        if (mimeType.match(/image\/*/) == null) {
            return;
        }

        var reader = new FileReader();
        reader.readAsDataURL(this.fileData);
        reader.onload = (_event) => {
            this.previewUrl = reader.result;
        }
    }

  get f() { return this.fillForm.controls; }

  onUpload() {
      // const formData = new FormData();
      // formData.append('file', this.fileData);
      // this.http.post('http://localhost/invoice-angular/api/companies/uploader.php', formData)
      //     .subscribe(res => {
      //         console.log(res);
      //         // this.uploadedFilePath = res.data.filePath;
      //         alert('SUCCESS !!');
      //     });
      const formData: FormData = new FormData();
      formData.append('image', this.fileToUpload, this.fileToUpload.name);
      this.http.post('http://localhost/invoice-angular/api/companies/uploader.php', formData).subscribe(
          (response) => {
              console.log(response);
          }
      );
  }

  onSubmit() {
  }

}
