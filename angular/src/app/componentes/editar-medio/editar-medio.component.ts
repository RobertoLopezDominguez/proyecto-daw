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
  public afuConfig;

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

  ngOnInit(): void {
    //Cargo la identidad y el token del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Cargo el medio
    this.getMedio();

    //URL del API
    this.url = global.url;
  }

  onSubmit(imagen){

  }

  subirImagen(evento){}


  
  getMedio(){
    //Recupero el Id del post de la URL
    this._route.params.subscribe(
      params => {
        let id = params['id'];

        //Petición AJAX para recuperar el post en cuestión
        this._medioService.getMedioById(id).subscribe(
          response => {
            if(response.estado == 'éxito'){
              this.medio = response.medio;
              console.log(this.medio);
            }
          },
          error => { 
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );
      });
  }
}
