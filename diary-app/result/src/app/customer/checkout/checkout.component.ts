import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';
import {MatDialog} from '@angular/material/dialog';
import { DialogboxComponent } from './dialogbox/dialogbox.component'
import { valid } from 'joi';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  constructor(
    private customerService: CustomerService, 
    public dialog: MatDialog
    ) { }
  
  //to store the paymentmode. 1 = card, 2 = paypal
  paymentOptions : number = 0;

  //for delivery option
  deliveryOption: number = 1;

  ngOnInit() {
    
  }

  //form for address 
  addressForm = new FormGroup({
    fullname: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required])
  })

  //form for credit card details
  creditCardForm = new FormGroup({
    cardnumber: new FormControl('', [Validators.required, Validators.maxLength(16)]),
    expirydate: new FormControl('', [Validators.required]),
    securitycode: new FormControl('', [Validators.required, Validators.maxLength(3)])
  });

  //form for paypal details
  paypalForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  //grouping all the forms
  forms_combined = new FormGroup({
    user: this.addressForm,
    creditcard: this.creditCardForm,
    paypal: this.paypalForm
  })

  //for address validations
  get fullname(): any { return this.addressForm.get('fullname'); }
  get email(): any { return this.addressForm.get('email'); }
  get phone(): any { return this.addressForm.get('phone'); }
  get address(): any { return this.addressForm.get('address'); }

  get cardnumber(): any { return this.creditCardForm.get('cardnumber'); } 
  get expirydate(): any { return this.creditCardForm.get('expirydate'); }
  get securitycode(): any { return this.creditCardForm.get('securitycode'); }

  get paypalemail(): any { return this.paypalForm.get('email'); }
  get password(): any { return this.paypalForm.get('password'); }

  //opens modal/dialog box
  openDialog(message: string, fromServer: boolean = false): void {
    const dialogRef = this.dialog.open(DialogboxComponent, {
      width: '300px',
      data: {msg: message, isservermsg: fromServer}
    });
  }

  //process checkout.
  checkout(){  

    if( !this.addressForm.valid ){
      console.log("address invalid")
      this.openDialog("Please fill out the delivery details");
      return;   
    } 
    
    if( this.paymentOptions == 0 ){
      this.openDialog("Please enter payment details.");
      return;
    }
    else if( (this.paymentOptions == 1 && !this.creditCardForm.valid) || 
      ( this.paymentOptions == 2 && !this.paypalForm.valid)) {

        if(this.paymentOptions == 1){
          this.openDialog("Payment failure. Please enter the correct credit card details.");
        }else{
          this.openDialog("Payment failure. Please enter the correct paypal details.");
        }
        return;
      }
      
    let sub: Subscription = this.customerService.diaryDetails$.subscribe(diary => {
      /** Filtering empty customizations */
      diary[0].customizations = diary[0].customizations.filter((customization)=>{
        return customization.name != ""
      })

      let data = {
        items: diary, 
        user : this.addressForm.value, 
        payment_method : this.paymentOptions == 1 ? "card" : "paypal", 
        delivery_method : this.deliveryOption == 1 ? "standard" : "express"  
      };

      console.log(data);

      this.customerService.processCheckout(data)
      .subscribe(data => {
        sub.unsubscribe();
        if(data.createdAt){
          this.openDialog("Success, transaction complete.", true);
          this.forms_combined.reset();
        }else{
          this.openDialog(data.name, true);
        }
      });
    })
  }
}
