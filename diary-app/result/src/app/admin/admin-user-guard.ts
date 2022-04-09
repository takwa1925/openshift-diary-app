import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class OnlyAdminUsersGuard implements CanActivate {
  
  constructor(public router: Router) {}
  canActivate() {
    if(!AuthService.$initialURLPath) {
      AuthService.$initialURLPath = window.location.pathname
    }
    const user = (<any>window).user;
    if(user) {
      if(!user.isAdmin){
        if(AuthService.$initialURLPath.match('/customer/'))
          this.router.navigate([AuthService.$initialURLPath]);
        else
          this.router.navigate(['/customer']);
      }
    } else 
      this.router.navigate(['/auth/login']);
    return user && user.isAdmin;
  }
}
