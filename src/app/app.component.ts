import {Component, OnDestroy, OnInit} from '@angular/core';
import {ToolsService} from './shared/services/tools.service';
import {AuthGuard} from './shared/tools/auth.guard';
import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './shared/services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService) {}
  ngOnInit(): void {

  }

  // @HostListener("window:onbeforeunload",["$event"])
  // clearLocalStorage(event){
  //
  //   localStorage.clear();
  //   localStorage.removeItem('jwt');
  //   localStorage.setItem('access_level', '2');
  // }
  //
  // jQuery(window).unload(function() {
  //   localStorage.removeItem('jwt');
  // });

  title = 'Easy Invoice Maker';
}
