/**
 * Componente que muestra la pantalla de inicio con las entradas publicadas
 */
import { Component, OnInit } from '@angular/core';
import { EntradaService } from '../../servicios/entrada.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [EntradaService]
})
export class InicioComponent implements OnInit {

  public page_title: string;
  public entradas;
  public url;

  constructor(
    private _entradaService: EntradaService
  ) {
    this.page_title = 'Inicio';
    //URL para peticiones AJAX a Laravel
    this.url = global.url;
   }

  ngOnInit(): void {
    //Cargo las entradas al iniciar el componente
    this.getEntradas();
  }

  //Método que recupera todas las entradas publicadas
  getEntradas(){
    //Petición para recuperar las entradas publicadas
    this._entradaService.getEntradasPublicadas().subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.entradas = response.entradas;
        }
      },
      error => { 
        console.log(error);
      }
    );
  }

}
