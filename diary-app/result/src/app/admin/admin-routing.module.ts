import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from './admin.component';
import { OnlyAdminUsersGuard } from './admin-user-guard';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { ManageAdminComponent } from './manage-admin/manage-admin.component';
import { CustomizeDiaryComponent } from './customize-diary/customize-diary.component';
import {GenerateReportComponent} from './generate-report/generate-report.component';
import { OrdersComponent } from '../shared/orders/orders.component';

const routes: Routes = [{
  path: 'admin',
  canActivate: [OnlyAdminUsersGuard],
  children: [
    {
      path: '',
      component: CustomizeDiaryComponent,
    }, {
      path: 'create',
      component: CreateAdminComponent,
    }, {
      path: 'manage',
      component: ManageAdminComponent,
    }, {
      path: 'customize-diary',
      component: CustomizeDiaryComponent,
    }, {
      path: 'orders',
      component: OrdersComponent,
    }, {
      path: 'generate-report',
      component: GenerateReportComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
