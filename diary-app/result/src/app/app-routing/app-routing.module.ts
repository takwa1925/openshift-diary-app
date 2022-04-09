import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlyCustomerUsersGuard } from '../customer/customer-user-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [OnlyCustomerUsersGuard],
    loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'customer',
    loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
