import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {

  userForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatPassword: new FormControl('', [Validators.required, this.passwordsMatchValidator])
  });

  passwordsMatchValidator(control: FormControl): ValidationErrors {
    let password = control.root.get('password');
    return password && control.value !== password.value ? {
      passwordMatch: true
    } : null;
  }


  get fullname(): any { return this.userForm.get('fullname'); }
  get email(): any { return this.userForm.get('email'); }
  get password(): any { return this.userForm.get('password'); }
  get repeatPassword(): any { return this.userForm.get('repeatPassword'); }

  constructor(private adminService: AdminService, private router: Router) { }

  ngOnInit() {
  }

  createAdmin() {

    if (!this.userForm.valid) {
      alert("Email, password & full name is required")
      return;
    }

    let {
      fullname,
      email,
      password,
      repeatPassword
    } = this.userForm.getRawValue();

    this.adminService.createAdmin(fullname, email, password, repeatPassword)
      .subscribe(data => {
        if(data.isSuccess ==true){
          alert("Admin Created Successfully!");
          this.router.navigate(['admin']);
        } else
          alert("Admin Creation Failed");
      }, errorResponse => {
        alert("This email is already taken");
      })
  }
}
