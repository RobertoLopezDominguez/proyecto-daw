import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaEntradaComponent } from './nueva-entrada.component';

describe('NuevaEntradaComponent', () => {
  let component: NuevaEntradaComponent;
  let fixture: ComponentFixture<NuevaEntradaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaEntradaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaEntradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
