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
  public usuarios;
  public identidad;
  public token;

  //Iconos
  public faTrashAlt = faTrashAlt;
  public faEdit = faEdit;
  public faTimesCircle = faTimesCircle;
  public faPlayCircle = faPlayCircle;

  constructor(
    private _usuarioService: UsuarioService
  ) { 
    this.page_title = 'Administración de usuarios';

    //Recupero la identidad del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();
  }

  ngOnInit(): void {
    this.getUsuarios();
  }

  getUsuarios(){
    this._usuarioService.getUsuarios(this.token).subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.usuarios = response.usuarios;
          console.log(this.usuarios);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

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
        
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminar(id){
    this._usuarioService.eliminar(this.token, id).subscribe(
      response => {
        console.log(response);
        this.getUsuarios();
      },
      error => {
        console.log(error);
      }
    );
  }

}
