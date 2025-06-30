import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlayBethistoryComponent } from './parlay-bethistory.component';

describe('ParlayBethistoryComponent', () => {
  let component: ParlayBethistoryComponent;
  let fixture: ComponentFixture<ParlayBethistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParlayBethistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParlayBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
