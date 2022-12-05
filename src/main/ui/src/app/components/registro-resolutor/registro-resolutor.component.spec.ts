import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroResolutorComponent } from './registro-resolutor.component';

describe('RegistroResolutorComponent', () => {
  let component: RegistroResolutorComponent;
  let fixture: ComponentFixture<RegistroResolutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroResolutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroResolutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
