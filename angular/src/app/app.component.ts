import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuarioService } from './servicios/usuario.service';
import { ThrowStmt } from '@angular/compiler';
import { global } from './servicios/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioService]
})
export class AppComponent implements OnInit, DoCheck{
  title = 'Proyecto DAW';
  public identidad;
  public token;
  public url;

  constructor(
    public _usuarioService: UsuarioService
  ){
    this.cargarUsuario();
    this.url = global.url;
  }

  ngOnInit()
  {

  }

  ngDoCheck(){
    this.cargarUsuario();
  }

  cargarUsuario(){
        //Recupero la identidad del usuario autenticado para la vista
        this.identidad = this._usuarioService.getIdentidad();
        this.token = this._usuarioService.getToken();
  }
}
