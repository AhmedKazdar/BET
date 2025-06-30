import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoProfitlossComponent } from './bo-profitloss.component';

describe('BoProfitlossComponent', () => {
  let component: BoProfitlossComponent;
  let fixture: ComponentFixture<BoProfitlossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoProfitlossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
