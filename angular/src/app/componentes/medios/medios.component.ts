/**
 * Componente para gestionar los medios
 */
import { Component, OnInit } from '@angular/core';
import { NgbNav} from '@ng-bootstrap/ng-bootstrap'; //Para las pestañas

@Component({
  selector: 'app-medios',
  templateUrl: './medios.component.html',
  styleUrls: ['./medios.component.css'],
  providers: [NgbNav]
})
export class MediosComponent implements OnInit {

  public page_title: string;
  public pestana: string;
  active = 1; //Pestaña activa

  constructor() { 
    this.page_title = 'Medios';
    this.pestana = 'Biblioteca';
  }

  ngOnInit(): void {
  }



}
