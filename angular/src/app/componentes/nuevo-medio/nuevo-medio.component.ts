import { Component, OnInit } from '@angular/core';
import { Medio } from '../../modelos/medio';
import { UsuarioService } from '../../servicios/usuario.service';
import { MedioService } from '../../servicios/medio.service';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-nuevo-medio',
  templateUrl: './nuevo-medio.component.html',
  styleUrls: ['./nuevo-medio.component.css'],
  providers: [UsuarioService, MedioService]
})
export class NuevoMedioComponent implements OnInit {

  public medio: Medio;
  public identidad;
  public token;
  public url;
  public estado;

  //Configuración de subida de imágenes
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg, .png, jpeg, .gif",
    maxSize: "50",
    uploadAPI:  {
      url: global.url + "medio",
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
      attachPinBtn: 'Sube una imagen',
      afterUploadMsg_success: 'Imagen subida con éxito',
      afterUploadMsg_error: 'Fallo al subir la imagen'
    }
};

  constructor(
    private _usuarioService: UsuarioService,
    private _medioService: MedioService
  ) {

    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //URL del API
    this.url = global.url;

    /**
     * Creo un objeto para el medio vacío
     * 
     */
    this.medio = new Medio(
      1, '', '', '', 'Publicada', '', '', '', '',null
    );


   }

  ngOnInit(): void {
  }

  subirImagen(datos){
    let respuesta = JSON.parse(datos.response);
    this.medio = respuesta.medio;
    console.log(this.medio);
  }

  onSubmit(form){
    this._medioService.actualizar(this.token, this.medio).subscribe(
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
        console.log(<any>error);
      }
    );

  }

}
