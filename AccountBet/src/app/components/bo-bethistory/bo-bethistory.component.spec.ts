import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoBethistoryComponent } from './bo-bethistory.component';

describe('BoBethistoryComponent', () => {
  let component: BoBethistoryComponent;
  let fixture: ComponentFixture<BoBethistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoBethistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
