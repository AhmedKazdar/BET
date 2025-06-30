import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcProfitlossComponent } from './awc-profitloss.component';

describe('AwcProfitlossComponent', () => {
  let component: AwcProfitlossComponent;
  let fixture: ComponentFixture<AwcProfitlossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwcProfitlossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwcProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
