import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AdminService } from '../admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';


// User Interface
export interface User {
  fullname: String;
  email: String;
  roles: String;
  createdAt: String;
  isActive: boolean;
  _id: String;
  hashedPassword: String;
}

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin.component.html',
  styleUrls: ['./manage-admin.component.scss']
})

export class ManageAdminComponent implements OnInit {

  displayedColumns: string[] = ['fullname', 'email', 'createdAt', 'role', 'orders', 'isActive'];
  dataSource;
  user;
  data: User[];

  constructor(
    private _httpClient: HttpClient,
    private adminService: AdminService,
    public dialog: MatDialog,
    private router: Router) {
  }
  ngOnInit() {
    this.adminService.getUsers()
      .subscribe((data) => {
        if (!data) {
          return;
        }
        this.data = data.userList;
        this.dataSource = new MatTableDataSource<User>(this.data);
      });

  }

  activateUser(user) {
    if (user.isActive = true) {
      user.isActive = false;
      this.user = user;
    }
  }

  deactivateUser(user) {
    if (user.isActive = false) {
      user.isActive = true;
      this.user = user;
    }
  }

  editUser(user) {
    const dialogRef = this.dialog.open(DialogUpdateUser, {
      width: '200px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user = user;
      this.updateUser(user);
    }

    );
  }

  updateUser(user) {
    this.adminService.updateUsers(user)
      .subscribe((data) => {
        if (!data) {
          return;
        }
      });
  }
  /**
   * Handler for activate and deactivate of users 
   */
  toggleHandler(isChecked, user){
    user.isActive = isChecked;
    this.updateUser(user)
  }

  navigateToOrders(user) {
    this.router.navigate(['/admin/orders'], { queryParams: { email: user.email } })
  }

}

// Update User Page

@Component({
  selector: 'app-manage-admin',
  templateUrl: './manage-admin-edit.component.html',
  styleUrls: ['./manage-admin.component.scss']
})
export class DialogUpdateUser {

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateUser>,
    @Inject(MAT_DIALOG_DATA) public data: User) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
