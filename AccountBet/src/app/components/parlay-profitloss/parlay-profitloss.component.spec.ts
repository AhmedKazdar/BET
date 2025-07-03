import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlayProfitlossComponent } from './parlay-profitloss.component';

describe('ParlayProfitlossComponent', () => {
  let component: ParlayProfitlossComponent;
  let fixture: ComponentFixture<ParlayProfitlossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParlayProfitlossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParlayProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
