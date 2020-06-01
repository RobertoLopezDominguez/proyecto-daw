import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoMedioComponent } from './nuevo-medio.component';

describe('NuevoMedioComponent', () => {
  let component: NuevoMedioComponent;
  let fixture: ComponentFixture<NuevoMedioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoMedioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoMedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
