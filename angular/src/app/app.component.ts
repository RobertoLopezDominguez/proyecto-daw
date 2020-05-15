import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuarioService } from './servicios/usuario.service';
import { ThrowStmt } from '@angular/compiler';

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

  constructor(
    public _usuarioService: UsuarioService
  ){
    this.cargarUsuario();
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
