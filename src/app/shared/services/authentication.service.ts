import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {environment} from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<UserModel>;
    public currentUser: Observable<UserModel>;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
      this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  login(data: any) {
    // return this.http.post<any>('http://www.einvoicemaker.com/invoice/api/users/login.php', data)
    //     .pipe(map(user => {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       if (user['message'] === 'Successful login.'){
    //           localStorage.setItem('jwt', user['jwt']);
    //           localStorage.setItem('access_level', user['access_level']);
    //           localStorage.setItem('first_name', user['first_name']);
    //           localStorage.setItem('last_name', user['last_name']);
    //           localStorage.setItem('currentUser', JSON.stringify(user));
    //           this.currentUserSubject.next(user);
    //           return user;
    //       }
    //     }));
    return this.http.post<any>(`${environment.apiUrl}users/login`, data)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            if (user['message'] === 'Successful login.') {
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }
        }));
  }
  public logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/users/signin']);
  }
   public get currentUserValue(): UserModel {
       return this.currentUserSubject.value;
   }
   async tokenValidate(): Promise<any> {
      const jTokenValue = JSON.parse(localStorage.getItem('currentUser'));
      const tokenValue = jTokenValue['jwt'];

      const q = new Promise((resolve) => {
              if (!tokenValue) {
                  resolve('TE');
              } else {
                  const token: string = '{ "jwt" : "' + tokenValue + '" }';
                  this.userService.tokenCheck(token).subscribe(
                      (response) => {
                          if (response['message'] === 'AG') {
                              resolve('TV');
                          } else {
                              resolve('TIV');
                          }
                      });
              }
      });
      return q;
  }


}
