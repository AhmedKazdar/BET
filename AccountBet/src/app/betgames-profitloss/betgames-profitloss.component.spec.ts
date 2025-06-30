import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesProfitlossComponent } from './betgames-profitloss.component';

describe('BetgamesProfitlossComponent', () => {
  let component: BetgamesProfitlossComponent;
  let fixture: ComponentFixture<BetgamesProfitlossComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetgamesProfitlossComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesProfitlossComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
