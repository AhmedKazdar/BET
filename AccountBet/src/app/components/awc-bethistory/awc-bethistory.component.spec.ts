import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwcBethistoryComponent } from './awc-bethistory.component';

describe('AwcBethistoryComponent', () => {
  let component: AwcBethistoryComponent;
  let fixture: ComponentFixture<AwcBethistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwcBethistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwcBethistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
