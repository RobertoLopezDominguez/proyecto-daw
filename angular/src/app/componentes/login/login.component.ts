/**
 * Componente para la pantalla de login
 */
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Router, ActivatedRoute, Params } from '@angular/router'; //Para rutas, redirecciones, sacar datos de la URL, etc

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UsuarioService]
})
export class LoginComponent implements OnInit {

  public page_title: string;
  public usuario: Usuario;
  public estado: string;
  public mensajeError: string;
  public token;
  public identidad; //Datos del usuario autenticado

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.page_title = 'Login';

    
    /**
     * Creo un objeto para el usuario vacío
     * 
     * Por defecto el perfilId es 5 (Invitado)
     * y el estado 'Activo'
     */
    this.usuario = new Usuario(
      1, '', '', '5', '', 'Activo', '', '', ''
    );
   }

  ngOnInit(): void {
    //Se ejecuta siempre y cierra sesión cuando le llega el parámetro 'cerrar' por la URL
    this.logout();
  }

  /**
   * Método que se ejecuta al enviar el formulario
   * para autenticar a un usuario
   * 
   * Recibe el formulario
   * Guarda en el localStorage los datos del usuario y el token
   */
  onSubmit(form){
    //Llamo al método signup solo con el objeto del usuario
    //lo que devolverá el token si se realiza correctamente
    this._usuarioService.signup(this.usuario).subscribe(
      response => {
        //Compruebo si la respuesta no da error
        if(response.estado != 'error'){

          this.estado = 'éxito';
          this.token = response; //Almaceno el token

          //Llamo otra vez al método signup para recuperar los datos del usuario
          //Para ello esta vez incluyo un segundo parámetro true
          this._usuarioService.signup(this.usuario, true).subscribe(
            response => {
              this.identidad = response; //Almaceno los datos del usuario autenticado

              //Almaceno en localStorage los datos obtenidos para hacerlos persistentes
              localStorage.setItem('token', this.token);
              localStorage.setItem('identidad', JSON.stringify(this.identidad));

              //Redirección a la página principal
              this._router.navigate(['inicio']);
            },
            error => {
              this.estado = 'error';
              this.mensajeError = error.mensaje;
            }
          );
        }else{
          this.estado = 'error';
          this.mensajeError = response.mensaje;
        }
      },
      error => {
        this.estado = 'error';        
        this.mensajeError = error.mensaje;
      }
    );
  }

  /**
   * Método para cerrar sesión
   */
  logout(){
    //Recupero de la URL el parámetro 'cerrar'
    this._route.params.subscribe(params => {
      let logout = +params['cerrar'];

      //Si el parámetro está elimino la identidad y el token
      if(logout == 1){
        localStorage.removeItem('identidad');
        localStorage.removeItem('token');

        this.identidad = null;
        this.token = null;

        //Redirección a la página principal
        this._router.navigate(['inicio']);
      }
    });
  }

}
