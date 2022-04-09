import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AdminService } from './admin.service';
import { SharedModule } from '../shared/shared.module';
import { ManageAdminComponent, DialogUpdateUser } from './manage-admin/manage-admin.component';

// For Admin User Management
import {
  MatTableModule,
  MatGridListModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatDatepickerModule
} from '@angular/material';
import { MatSlideToggleModule, } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CustomizeDiaryComponent } from './customize-diary/customize-diary.component';
import { GenerateReportComponent } from './generate-report/generate-report.component';

@NgModule({
  declarations: [
    AdminComponent,
    CreateAdminComponent,
    CustomizeDiaryComponent,
    ManageAdminComponent,
    DialogUpdateUser,
    GenerateReportComponent
  ],
  entryComponents: [
    DialogUpdateUser
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    MatTableModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatGridListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSlideToggleModule
  ],
  providers: [
    AdminService,
    OnlyAdminUsersGuard
  ]
})
export class AdminModule { }
