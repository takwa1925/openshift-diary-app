import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {AuthService} from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  email: string;
  password: string;
  showErrorMsg: Boolean = false;
  errorMsg: String;

  ngOnInit() {
  }

  login(): void {
    console.log("login pressed");
    console.log(this.email + " | "+ this.password);
    if ( !this.email || !this.password ){
      this.showErrorMsg = true;
      this.errorMsg = "Please enter both username and password.";
      return;
    }

    this.authService.login(this.email, this.password)
    .subscribe(data => {   
        console.log("Message: " + data.error);  
        if ( data.error ){
          this.showErrorMsg = true;
          this.errorMsg = data.error;
          return;
        }
        else{
          this.router.navigate(['']);
        }
    })  
  }
}
