import {Component, HostListener, OnDestroy} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  ngOnDestroy(): void {

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

  title = 'invoice-angular';
}
