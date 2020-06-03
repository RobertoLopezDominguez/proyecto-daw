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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _medioService: MedioService
  ) {
    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Ruta actual
    this.rutaActual = _router;
    console.log(this.rutaActual.url);

    //URL para peticiones AJAX
    this.url = global.url;

    //Cargo todos los medios
    this.getMedios();

    this.error = null;
   }

  ngOnInit(): void {

  }

  getMedios(){
    this._medioService.getMedios().subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.medios = response.medios;
          console.log(this.medios);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  seleccionaMedio(medio){
    this._medioService.setMedioSeleccionado(medio.id);
    console.log("Hola");
  }

  borraMedio(id){
    console.log(this.token);
    this._medioService.borraMedio(this.token, id).subscribe(
      response => {
        if(response['estado'] == 'éxito'){
          this.getMedios();
          this.error = null;
        }
      },
      error => {
        this.error = error.error.mensaje;
      }
    );
  }

}
