/**
 * Componente para editar el perfi de un usuario
 */
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuarioService } from '../../servicios/usuario.service'; //Importo el servicio para Usuario
import { global } from '../../servicios/global';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
  providers: [UsuarioService]
})
export class PerfilUsuarioComponent implements OnInit {

  public page_title: string;
  public usuario: Usuario;
  public identidad;
  public token;
  public estado: string; 
  public url;

  //Configuración para la subida de ficheros de Angular-file-uploader
  public afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg, .png, jpeg, .gif",
      maxSize: "50",
      uploadAPI:  {
        url: global.url + "usuario/imagen",
        headers: {
          "Authorization": this._usuarioService.getToken()
        }
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      replaceTexts: {
        selectFileBtn: 'Selecciona el archivo',
        resetBtn: 'Reset',
        uploadBtn: 'Subir',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Sube tu imagen de usuario',
        afterUploadMsg_success: 'Imagen subida con éxito',
        afterUploadMsg_error: 'Fallo al subir la imagen'
      }
  };

  constructor(
    private _usuarioService: UsuarioService
  ) { 
    this.page_title = "Perfil de usuario";

    /**
     * Creo un objeto para el usuario vacío
     * 
     * Por defecto el perfilId es 5 (Invitado)
     * y el estado 'Activo'
     */
    this.usuario = new Usuario(
      1, '', '', '5', '', 'Activo', '', '', ''
    );

    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //URL del API
    this.url = global.url;

    //Cargo los datos del usuario en el objeto usuario
    //this.usuario = this.identidad;
    this.usuario = new Usuario(
      this.identidad.id,
      this.identidad.usuario,
      this.identidad.email,
      this.identidad.perfil_id,
      '',
      this.identidad.estado,
      this.identidad.nombre,
      this.identidad.apellidos,
      this.identidad.imagen
    );

  }

  ngOnInit(): void {
  }

  //Método que se ejecuta al enviar el formulario
  onSubmit(form){
    //Actualizo los datos del usuario
    this._usuarioService.actualizar(this.token, this.usuario).subscribe(
      response => {
        console.log(response);
        if(response['estado'] == 'éxito'){
          this.estado = 'éxito';
          
          //Actualizo los cambios del usuario en la sesión
          this.identidad = this.usuario;
          localStorage.setItem('identidad', JSON.stringify(this.identidad));
        }else{
          this.estado = 'error';
        }
      },
      error => {
        this.estado = 'error';
        console.log(<any>error);
      }
    );
  }

  //Medoto para subir una imagen
  //Recoge la respuesta de Angular-file-uploader según la configuración afuConfig
  subirImagen(datos){
    //Recupero la respuesta
    let respuesta = JSON.parse(datos.response);
    //Asigno al medio el medio de la respuesta
    this.usuario.imagen = respuesta.imagen;
  }

}
