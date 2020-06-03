import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { Entrada } from '../../modelos/entrada';
import { Medio } from 'src/app/modelos/medio';
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

  ngOnInit(): void {
    this.getEntradas();
    console.log(this.entradas);
  }

  getEntradas(){

    //Recupero el Id de la entrada de la URL
    this._route.params.subscribe(
    params => {
      let id = params['id']; 

        //Petición AJAX para recuperar las entradas publicadas
        this._entradaService.getEntradasPublicadasByCategoria(id).subscribe(
          response => {
            if(response.estado == 'éxito'){
              this.entradas = response.entradas;

              console.log(this.entradas);
            // this.getImagen(this.entrada.imagen_id);
            }
          },
          error => { 
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );

    });

  }

}
