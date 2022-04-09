import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { TokenStorage } from './token.storage';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AuthService {
  public static $initialURLPath: String;

  constructor(private http: HttpClient, private token: TokenStorage, private snackBar: MatSnackBar) {}

  public $userSource = new Subject<any>();

  login(email: string, password: string): Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/login', {
        email,
        password
      }).subscribe((data: any) => {
          console.log("at service");
          console.log(data);
          observer.next({user: data.user});
          this.setUser(data.user);
          this.token.saveToken(data.token);
          observer.complete();
      },
      (error) => {              
        if (error.status === 401) {
          observer.next({error: "Either username or password is incorrect"});
        }
      })      
    });
  }

  register(fullname : string, email : string, password : string, repeatPassword : string) : Observable <any> {
    return Observable.create(observer => {
      this.http.post('/api/auth/register', {
        fullname,
        email,
        password,
        repeatPassword
      }).subscribe((data: any) => {
        if (data.token) {
          observer.next({user: data.user});
          this.setUser(data.user);
          this.token.saveToken(data.token);
          observer.complete();
        } else {
          this.snackBar.open(data.Message, 'close', {
            duration: 2000,
          });
        }
      });
    });
  }

  setUser(user): void {
    if (user) user.isAdmin = (user.roles.indexOf('admin') > -1);
    this.$userSource.next(user);
    (<any>window).user = user;
  }

  getUser(): Observable<any> {
    return this.$userSource.asObservable();
  }

  me(): Observable<any> {
    return Observable.create(observer => {
      const tokenVal = this.token.getToken();
      if (!tokenVal) return  observer.complete();
      this.http.get('/api/auth/me').subscribe((data : any) => {
        observer.next({user: data.user});
        this.setUser(data.user);
        observer.complete();
      })
    });
  }

  signOut(): void {
    this.token.signOut();
    this.setUser(null);
    delete (<any>window).user;
  }
}
