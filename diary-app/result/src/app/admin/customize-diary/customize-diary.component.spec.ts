import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeDiaryComponent } from './customize-diary.component';

describe('CustomizeDiaryComponent', () => {
  let component: CustomizeDiaryComponent;
  let fixture: ComponentFixture<CustomizeDiaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeDiaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeDiaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
