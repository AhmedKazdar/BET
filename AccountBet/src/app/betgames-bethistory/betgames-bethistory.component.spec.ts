import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BetgamesBethistoryComponent } from './betgames-bethistory.component';

describe('BetgamesBethistoryComponent', () => {
  let component: BetgamesBethistoryComponent;
  let fixture: ComponentFixture<BetgamesBethistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BetgamesBethistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BetgamesBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
