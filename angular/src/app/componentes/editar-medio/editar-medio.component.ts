/**
 * Componente para editar un medio existente
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Medio } from '../../modelos/medio';
import { UsuarioService } from '../../servicios/usuario.service';
import { MedioService } from '../../servicios/medio.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-editar-medio',
  templateUrl: './editar-medio.component.html',
  styleUrls: ['../nuevo-medio/nuevo-medio.component.css'],
  providers: [UsuarioService, MedioService]
})
export class EditarMedioComponent implements OnInit {

  public medio: Medio;
  public identidad;
  public token;
  public url;
  public estado;
  public mensaje;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _medioService: MedioService
  ) { 
    /**
     * Creo un objeto para el medio vacío
     * 
     */
    this.medio = new Medio(
      1, '', '', '', 'Publicada', '', '', '', '',null
    );
  }

  //Al iniciar el componente
  ngOnInit(): void {
    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Cargo el medio
    this.getMedio();

    //URL del API
    this.url = global.url;
  }

  //Método que se ejecuta al enviar el formulario
  onSubmit(form){
    //Actualizo el medio
    this._medioService.actualizar(this.token, this.medio).subscribe(
      response => {
        if(response.estado = 'éxito'){
          this.estado = 'éxito';
          this.mensaje = response.mensaje;
        }
      },
      error => {
        this.estado = 'error';
      }
    );
  }


  /**
   * Método que recupera el medio seleccionado
   */
  getMedio(){
    //Recupero el Id del medio de la URL
    this._route.params.subscribe(
      params => {
        let id = params['id'];

        //Petición AJAX para recuperar el post en cuestión
        this._medioService.getMedioById(id).subscribe(
          response => {
            if(response.estado == 'éxito'){
              this.medio = response.medio;
            }
          },
          error => { 
            console.log(error);
            //Si hay un error redirijo a Inicio
            this._router.navigate(['/inicio']);
          }
        );
      });
  }
}
