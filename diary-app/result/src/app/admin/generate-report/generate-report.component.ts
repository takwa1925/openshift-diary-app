import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AdminService} from '../admin.service';
import {Order} from '../../shared/DiaryCustomizationData';

@Component({
  selector: 'app-generate-report',
  templateUrl: './generate-report.component.html',
  styleUrls: ['./generate-report.component.scss']
})
export class GenerateReportComponent implements OnInit {

  public startDate: Date;
  public report: any;
  public period: string;
  public params: {
    startDate: Date,
    period: string
  };
  public orders: Order[];
  constructor(
    private adminService: AdminService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.params = {
      startDate : new Date(),
      period: 'MONTH'
    };
    this.params.startDate.setDate(1);
    this.updateReport();
  }

  updateReport() {
    if (this.params.period === undefined || this.params.startDate === undefined) {
      return null;
    }
    if (this.params.startDate === null) {
      this.snackBar.open('Select a ' + this.params.period + ' to generate the report', 'close', {
        duration: 4000,
      });
      return null;
    }
    const sub = this.adminService.getReport(this.params)
      .subscribe((data) => {
        sub.unsubscribe();
        if (!data) {
          return;
        }
        this.orders = data.orderList;
        if (this.orders == null) {
          this.report = {};
        } else {
          this.report = {
            totalOrders: this.orders.length,
            totalDiaries: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                  return prevItem + currItem.quantity;
                }, 0);
              }, 0),
            totalRevenue: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.total;
            }, 0),
            totalFromBase: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                return prevItem + currItem.basePrice * currItem.quantity;
              }, 0);
            }, 0),
            totalFromPaperColor: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                return prevItem + currItem.customizations.reduce((prevCust, currCust) => {
                  if (currCust.type === 'paperColor') {
                  return prevCust + currCust.price;
                  } else {
                    return prevCust;
                  }
                }, 0) * currItem.quantity;
              }, 0);
            }, 0),
            totalFromCoverTheme: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                return prevItem + currItem.customizations.reduce((prevCust, currCust) => {
                  if (currCust.type === 'coverTheme') {
                  return prevCust + currCust.price;
                  } else {
                    return prevCust;
                  }
                }, 0) * currItem.quantity;
              }, 0);
            }, 0),
            totalFromPaperType: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                return prevItem + currItem.customizations.reduce((prevCust, currCust) => {
                  if (currCust.type === 'paperType') {
                  return prevCust + currCust.price;
                  } else {
                    return prevCust;
                  }
                }, 0) * currItem.quantity;
              }, 0);
            }, 0),
            totalFromCustomization: this.orders.reduce((previousValue, currentValue) => {
              return previousValue + currentValue.items.reduce((prevItem, currItem) => {
                return prevItem + currItem.customizations.reduce((prevCust, currCust) => {
                  if (currCust.price) {
                  return prevCust + currCust.price;
                  } else {
                    return prevCust;
                  }
                }, 0) * currItem.quantity;
              }, 0);
            }, 0)
          };
        }
      });
  }

}
