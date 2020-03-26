import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Easy Invoice Maker';
  constructor(public authenticationService: AuthenticationService) {}
  ngOnInit(): void {

  }

}
