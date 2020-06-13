/**
 * Componente para mostrar el detalle de una entrada
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { Entrada } from '../../modelos/entrada';
import { Medio } from 'src/app/modelos/medio';
import { global } from '../../servicios/global';
import { faUserAlt, faTags } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-entrada-unica',
  templateUrl: './entrada-unica.component.html',
  styleUrls: ['./entrada-unica.component.css'],
  providers: [EntradaService, MedioService]
})
export class EntradaUnicaComponent implements OnInit {

  public entrada;
  public imagen;
  public url;

  //Iconos
  public faUserAlt = faUserAlt;
  public faTags = faTags;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _entradaService: EntradaService,
    private _medioService: MedioService
  ) {
    //URL para peticiones AJAX a Laravel
    this.url = global.url;

    //Creo un objeto de tipo Entrada para ir rellenándolo
    this.entrada = new Entrada(1,null,1,'Borrador','','',null,null);
    this.imagen = new Medio(1, '', '', '', 'Publicada', '', '', '', '',null);
   }

  //Al iniciar el componente
  ngOnInit(): void {
    //Recupero la entrada
    this.getEntrada();
  }

  //Método que recupera la entrada en cuestión
  getEntrada(){
    //Recupero el Id de la entrada de la URL
    this._route.params.subscribe(
      params => {
        let id = params['id'];

        //Petición AJAX para recuperar la entrada en cuestión
        this._entradaService.getEntrada(id).subscribe(
          response => {
            if(response.estado == 'éxito'){
              this.entrada = response.entrada;
              //Compruebo que la entrada está publicada
              if(this.entrada.estado != 'Publicada'){
                //Si no está publicada redirijo a Inicio
                this._router.navigate(['/inicio']);
              }
              //Recupero la imagen de esta entrada
              this.getImagen(this.entrada.imagen_id);
            }
          },
          error => { 
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );

      });
  }

  //Método que recupera la entrada de la imagen
  getImagen(id){
    //Recupero el medio asociado a la entrada
    this._medioService.getMedioById(id).subscribe(
      response => {
          if(response.estado == 'éxito'){
            this.imagen = response.medio;
          }
        },
        error => {
          console.log(error);
        }
    );
  }

}
