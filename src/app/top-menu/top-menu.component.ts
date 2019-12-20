import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.css']
})
export class TopMenuComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  onSignOut() {
    this.authenticationService.logout();
  }


}
