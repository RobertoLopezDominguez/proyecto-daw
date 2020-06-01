import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BibliotecaMediosComponent } from './biblioteca-medios.component';

describe('BibliotecaMediosComponent', () => {
  let component: BibliotecaMediosComponent;
  let fixture: ComponentFixture<BibliotecaMediosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BibliotecaMediosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BibliotecaMediosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
