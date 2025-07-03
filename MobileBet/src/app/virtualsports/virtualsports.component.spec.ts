import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualsportsComponent } from './virtualsports.component';

describe('VirtualsportsComponent', () => {
  let component: VirtualsportsComponent;
  let fixture: ComponentFixture<VirtualsportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VirtualsportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualsportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
