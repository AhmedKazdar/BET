import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiMarketsComponent } from './multi-markets.component';

describe('MultiMarketsComponent', () => {
  let component: MultiMarketsComponent;
  let fixture: ComponentFixture<MultiMarketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiMarketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiMarketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
