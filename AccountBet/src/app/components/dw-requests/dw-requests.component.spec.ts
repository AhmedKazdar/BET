import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DwRequestsComponent } from './dw-requests.component';

describe('DwRequestsComponent', () => {
  let component: DwRequestsComponent;
  let fixture: ComponentFixture<DwRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DwRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DwRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
