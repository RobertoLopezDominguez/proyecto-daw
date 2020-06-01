import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMedioComponent } from './editar-medio.component';

describe('EditarMedioComponent', () => {
  let component: EditarMedioComponent;
  let fixture: ComponentFixture<EditarMedioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarMedioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMedioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
