import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  authcheck;
  optionsSelect: Array<any>;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    if (this.authenticationService.tokenValidate()){
       this.authcheck = 'true';
    }else{
      this.authcheck = 'false';
    }
    this.optionsSelect = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
  }




}
