/**
 * Componente que lista todas las entradas publicadas de una categoría
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css'],
  providers: [EntradaService, MedioService]
})
export class CategoriaComponent implements OnInit {

  public page_title: string;
  public entradas;
  public url;

  //Inyecto los servicios en el constructor
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _entradaService: EntradaService,
    private _medioService: MedioService
  ) {
    this.page_title = 'Inicio';
    //URL para peticiones AJAX a Laravel
    this.url = global.url;
   }

  //Al iniciar el componente cargo todas las entradas de la categoría
  ngOnInit(): void {
    this.getEntradas();
  }

  /**
   * Método que recupera las entradas publicadas de una categoría
   */
  getEntradas(){
    //Recupero el Id de la categoría de la URL
    this._route.params.subscribe(
    params => {
      let id = params['id']; 

      //Petición al servicio para recuperar las entradas publicadas por ID
      this._entradaService.getEntradasPublicadasByCategoria(id).subscribe(
        response => {
          if(response.estado == 'éxito'){
            //Asigno las entradas de la respuesta al objeto entradas
            this.entradas = response.entradas;
          }
        },
        error => { 
          //Si hay un error redirijo a Inicio
          this._router.navigate(['/inicio']);
        }
      );

    });

  }

}
