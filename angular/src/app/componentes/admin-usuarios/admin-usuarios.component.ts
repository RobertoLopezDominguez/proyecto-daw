/**
 * Componente para la gestión de usuarios
 */
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { faEdit, faTrashAlt, faTimesCircle, faPlayCircle, } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
  providers: [UsuarioService]
})
export class AdminUsuariosComponent implements OnInit {

  public page_title: string;
  public usuarios; //Objeto donde se guardarán los usuarios
  public identidad;
  public token;
  public estado;

  //Iconos
  public faTrashAlt = faTrashAlt;
  public faEdit = faEdit;
  public faTimesCircle = faTimesCircle;
  public faPlayCircle = faPlayCircle;

  //En el contructor inyecto los servicios que voy a usar
  constructor(
    private _usuarioService: UsuarioService
  ) { 
    //Título de la página
    this.page_title = 'Administración de usuarios';

    //Recupero la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();
  }

  //Al iniciar el componente recupero los usuarios
  ngOnInit(): void {
    this.getUsuarios();
  }

  /**
   * Método que devuelve los usuarios
   */
  getUsuarios(){
    //Recupero los usuarios haciendo la petición al servicio
    this._usuarioService.getUsuarios(this.token).subscribe(
      response => {
        //Si la respuesta es correcta
        if(response.estado == 'éxito'){
          //Asigno la respuesta al objeto usuarios
          this.usuarios = response.usuarios;
        }
      },
      error => {
        console.log(error); //Si hay un error lo muestro por consola
      }
    );
  }

  /**
   * Método que intercambia el estado de un usuario
   * de 'Activo' a 'Desactivado' y viceversa
   */
  cambiaEstado(usuario){

    //Asigno el nuevo estado al usuario
    if(usuario.estado == "Activo"){
      usuario.estado = "Desactivado";
    }else{
      usuario.estado = "Activo";
    }

    //Creo un JSON con los datos para actualizar el estaado
    let usuarioAux = {"id" : usuario.id, "estado" : usuario.estado};
    
    //Actualizo al entrada
    this._usuarioService.actualizar(this.token, usuarioAux).subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.estado = 'éxito';
        }
      },
      error => {
        this.estado = 'error';
        console.log(error);
      }
    );
  }

  /**
   * Método que elimina un usuario por ID
   */
  eliminar(id){
    //Elimino el usuario por medio del médodo correspondiente del servicio
    this._usuarioService.eliminar(this.token, id).subscribe(
      response => {
        //Una vez eliminado actualizo los usuarios
        this.getUsuarios();
      },
      error => {
        console.log(error);
      }
    );
  }

}
