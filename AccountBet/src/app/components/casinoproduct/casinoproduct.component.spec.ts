import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CasinoproductComponent } from './casinoproduct.component';

describe('CasinoproductComponent', () => {
  let component: CasinoproductComponent;
  let fixture: ComponentFixture<CasinoproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CasinoproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CasinoproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
