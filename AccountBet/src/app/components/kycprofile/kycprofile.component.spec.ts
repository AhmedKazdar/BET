import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycprofileComponent } from './kycprofile.component';

describe('KycprofileComponent', () => {
  let component: KycprofileComponent;
  let fixture: ComponentFixture<KycprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
