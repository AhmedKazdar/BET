import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoProfitlossComponent } from './casino-profitloss.component';

describe('CasinoProfitlossComponent', () => {
  let component: CasinoProfitlossComponent;
  let fixture: ComponentFixture<CasinoProfitlossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoProfitlossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
