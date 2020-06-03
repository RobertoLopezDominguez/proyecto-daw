import { Component, OnInit } from '@angular/core';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { Entrada } from '../../modelos/entrada';
import { Medio } from 'src/app/modelos/medio';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [EntradaService, MedioService]
})
export class InicioComponent implements OnInit {

  public page_title: string;
  public entradas;
  public url;

  constructor(
    private _entradaService: EntradaService,
    private _medioService: MedioService
  ) {
    this.page_title = 'Inicio';
    //URL para peticiones AJAX a Laravel
    this.url = global.url;
   }

  ngOnInit(): void {
    this.getEntradas();
    console.log(this.entradas);
  }

  getEntradas(){
    //Petición AJAX para recuperar las entradas publicadas
    this._entradaService.getEntradasPublicadas().subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.entradas = response.entradas;

          console.log(this.entradas);
         // this.getImagen(this.entrada.imagen_id);
        }
      },
      error => { 
        console.log(error);
      }
    );
  }

}
