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

  ngOnInit(): void {
    this.getEntrada();
    console.log(this.imagen);
    console.log(this.entrada);
  }

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
                this._router.navigate(['/inicio']);
              }
              console.log(this.entrada);
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

  getImagen(id){

    //Recupero el medio asociado a la entrada
    this._medioService.getMedioById(id).subscribe(
      response => {
          if(response.estado == 'éxito'){
            this.imagen = response.medio;
            console.log(this.imagen);
          }
        },
        error => {
          console.log(error);

        }
    );
  }

}
