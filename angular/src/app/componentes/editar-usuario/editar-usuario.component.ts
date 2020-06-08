import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Usuario } from 'src/app/modelos/Usuario';
import { UsuarioService } from '../../servicios/usuario.service'; 
import { PerfilService } from '../../servicios/perfil.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css'],
  providers: [UsuarioService, PerfilService]
})
export class EditarUsuarioComponent implements OnInit {

  public page_title: string;
  public usuario: Usuario;
  public usuarioOriginal: Usuario;
  public perfiles;
  public identidad;
  public token;
  public estado: string; 
  public mensajeError: string; 
  public url;

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
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _perfilService: PerfilService
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
    this.usuario = new Usuario(1,'','','','','','','','');

  }

  ngOnInit(): void {
    this.getUsuario();
    this.getPerfiles();
  }

  onSubmit(form){
    //Creo una copia del objeto del usuario para enviarlo al actualizar
    let usuarioCopia = JSON.parse(JSON.stringify(this.usuario));
    //Copruebo si los campos únicos han cambiado para no enviarlos si no lo han hecho
    if(usuarioCopia.usuario == this.usuarioOriginal.usuario){
      delete usuarioCopia.usuario;
    }
    if(usuarioCopia.email == this.usuarioOriginal.email){
      delete usuarioCopia.email;
    }

    this._usuarioService.actualizar(this.token, usuarioCopia).subscribe(
      response => {
        console.log(response);
        if(response['estado'] == 'éxito'){
          this.estado = 'éxito';
        }else{
          this.estado = 'error';
        }
      },
      error => {
        this.estado = 'error';
        this.mensajeError = error.error.mensaje;
        console.log(error);
      }
    );
  }

  subirImagen(datos){
    let respuesta = JSON.parse(datos.response);
    this.usuario.imagen = respuesta.imagen;
  }

  //Recupero el usuario
  getUsuario(){
    //Recupero el Id del usuario de la URL
    this._route.params.subscribe(
      params => {
        let id = params['id'];

        //Recupero el usuario con la ID
        this._usuarioService.getUsuarioById(this.token, id).subscribe(
          response => {
            if(response.estado == "éxito"){
              this.usuario = response.usuario;
              this.usuarioOriginal = JSON.parse(JSON.stringify(this.usuario));
              console.log(this.usuario);
            }
          },
          error => {
            console.log(error);
          }
        );
    }); 
  }

  getPerfiles(){
    //Recupero todos los perfiles
    this._perfilService.getPerfiles().subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.perfiles = response.perfiles;
          console.log(this.perfiles);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  
}

