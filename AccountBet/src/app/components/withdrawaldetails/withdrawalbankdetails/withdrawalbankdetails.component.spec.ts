import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalbankdetailsComponent } from './withdrawalbankdetails.component';

describe('WithdrawalbankdetailsComponent', () => {
  let component: WithdrawalbankdetailsComponent;
  let fixture: ComponentFixture<WithdrawalbankdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalbankdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalbankdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
