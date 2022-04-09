import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import {CoverThemeData, DiaryCustomizationData, PaperColorData} from '../../shared/DiaryCustomizationData';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-customize-diary',
  templateUrl: './customize-diary.component.html',
  styleUrls: ['./customize-diary.component.scss']
})
export class CustomizeDiaryComponent implements OnInit {
  constructor(private adminService: AdminService, private snackBar: MatSnackBar) { }

  diaryCustomization: DiaryCustomizationData;
  ngOnInit() {
    this.adminService.getDiaryCustomization().subscribe(data => {
      this.diaryCustomization = data[0];
      if (this.diaryCustomization === undefined) {
        this.diaryCustomization = {
          name: 'Diary',
          basePrice: 0,
          customization: {
            paperColor: [
              { name: 'color 1', price: 21, value: '#00FF00', isActive: true },
              { name: 'red', value: '#800000', price: 10, isActive: true }
            ],
            coverTheme: [{ name: 'cover 1', price: 21, image: 'bg.jpg', isActive: true }],
            paperType: [{ name: 'paper 1', price: 22, isActive: true }],
            hasCoverText: true
          }
        };
      }
    }, errorResponse => {
      alert(errorResponse.error.message);
    });

  }

  updateCustomization() {
    const duplicateColor = this.diaryCustomization.customization.paperColor.reduce((acc, currentValue, index) => {
      if (this.diaryCustomization.customization.paperColor.map(value =>
        value.name.toLowerCase()).indexOf(currentValue.name.toLowerCase()) !== index) {
        acc = currentValue;
      }
      return acc;
    }, null);
    if (duplicateColor) {
      this.snackBar.open(duplicateColor.name + ' color already exists', 'close', {
        duration: 5000,
      });
      this.ngOnInit();
      return;
    }
    const duplicateTheme = this.diaryCustomization.customization.coverTheme.reduce((acc, currentValue, index) => {
      if (this.diaryCustomization.customization.coverTheme.map(value =>
        value.name.toLowerCase()).indexOf(currentValue.name.toLowerCase()) !== index) {
        acc = currentValue;
      }
      return acc;
    }, null);
    if (duplicateTheme) {
      this.snackBar.open(duplicateTheme.name + ' Theme already exists', 'close', {
        duration: 5000,
      });
      this.ngOnInit();
      return;
    }
    this.adminService.updateDiaryCustomization(this.diaryCustomization).subscribe(data => {
      this.snackBar.open('Diary Customization updated', 'close', {
        duration: 4000,
      });
      this.ngOnInit();
    });
  }

  deleteColor(index: number) {
    if (confirm('Are you sure you want to delete?')) {
      const deletedNode: PaperColorData[] = this.diaryCustomization.customization.paperColor.splice(index, 1);
      if (deletedNode[0].name != null) {
        this.updateCustomization();
      }
    }
  }
  deleteTheme(index: number) {
    const deletedNode: CoverThemeData[] = this.diaryCustomization.customization.coverTheme.splice(index, 1);
    if (deletedNode[0].name != null) {
      this.updateCustomization();
    }
  }
  addNewColorPalette() {
    const paperColor: PaperColorData = {
      name: null,
      value: '#fff',
      price: 0,
      isActive: true
    };
    if (this.diaryCustomization.customization.paperColor) {
      this.diaryCustomization.customization.paperColor.push(paperColor);
    } else {
      this.diaryCustomization.customization.paperColor = [paperColor];
    }
  }

  addNewCoverTheme() {
    const coverTheme: CoverThemeData = {
      name: null,
      image: 'bg.jpg',
      price: 0,
      isActive: true
    };
    if (this.diaryCustomization.customization.coverTheme) {
      this.diaryCustomization.customization.coverTheme.push(coverTheme);
    } else {
      this.diaryCustomization.customization.coverTheme = [coverTheme];
    }
  }
}
