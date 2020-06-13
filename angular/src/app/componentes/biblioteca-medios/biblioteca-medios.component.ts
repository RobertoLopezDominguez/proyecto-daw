/**
 * Componente que muestra la biblioteca de medios
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { MedioService } from '../../servicios/medio.service';
import { global } from '../../servicios/global';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-biblioteca-medios',
  templateUrl: './biblioteca-medios.component.html',
  styleUrls: ['./biblioteca-medios.component.css'],
  providers: [UsuarioService, MedioService]
})
export class BibliotecaMediosComponent implements OnInit {

  public medios;
  public identidad;
  public token;
  public url;
  public rutaActual;
  public faEdit = faEdit;
  public faTrashAlt = faTrashAlt;
  public error;

  //Inyecto los servicios en el constructor
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _medioService: MedioService
  ) {
    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Ruta actual para comprobar en qué página estamos
    this.rutaActual = _router;
    console.log(this.rutaActual.url);

    //URL para peticiones AJAX
    this.url = global.url;

    //Cargo todos los medios
    this.getMedios();

    this.error = null;
  }

  ngOnInit(): void {  }

  /**
   * Método que recupera todos los medios
   */
  getMedios(){
    //Hago la petición al servicio de medios
    this._medioService.getMedios().subscribe(
      response => {
        if(response.estado == 'éxito'){
          //Si es correto asigno la respuesta al objeto medios
          this.medios = response.medios;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * Método que guarda el medio seleccionado
   * para asignalo a una entrada
   */
  seleccionaMedio(medio){
    this._medioService.setMedioSeleccionado(medio.id);
  }

  /**
   * Método que borra un medio por ID
   */
  borraMedio(id){
    //Llamo al método del servicio que borra un medio
    this._medioService.borraMedio(this.token, id).subscribe(
      response => {
        if(response['estado'] == 'éxito'){
          //Si se ha borrado correctamente actualizo los medios
          this.getMedios();
          this.error = null;
        }
      },
      error => {
        //Si hay un error le asigno el mensaje devuelto por el servidor
        this.error = error.error.mensaje;
      }
    );
  }

}
