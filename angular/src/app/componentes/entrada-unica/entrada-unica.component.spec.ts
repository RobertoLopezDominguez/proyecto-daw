import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntradaUnicaComponent } from './entrada-unica.component';

describe('EntradaUnicaComponent', () => {
  let component: EntradaUnicaComponent;
  let fixture: ComponentFixture<EntradaUnicaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaUnicaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntradaUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
