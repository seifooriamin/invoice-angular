import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
declare var jQuery: any;
@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['../app.component.css']
})
export class TopMenuComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    jQuery('ul.navbar-nav li.dropdown').hover(function() {
      jQuery(this).find('.dropdown-menu').fadeIn(500);
    },
    function() {
      jQuery(this).find('.dropdown-menu').hide();
    });
  }

  onSignOut() {
    this.authenticationService.logout();
  }



}
