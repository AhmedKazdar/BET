import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawalupidetailsComponent } from './withdrawalupidetails.component';

describe('WithdrawalupidetailsComponent', () => {
  let component: WithdrawalupidetailsComponent;
  let fixture: ComponentFixture<WithdrawalupidetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithdrawalupidetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawalupidetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
