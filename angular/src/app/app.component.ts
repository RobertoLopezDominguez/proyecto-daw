import { Component, OnInit, DoCheck } from '@angular/core';
import { UsuarioService } from './servicios/usuario.service';
import { CategoriaService } from './servicios/categoria.service';
import { ThrowStmt } from '@angular/compiler';
import { global } from './servicios/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioService, CategoriaService]
})
export class AppComponent implements OnInit, DoCheck{
  title = 'Proyecto DAW';
  public identidad;
  public token;
  public url;
  public categorias;

  constructor(
    private _usuarioService: UsuarioService,
    private _categoriaService: CategoriaService
  ){
    this.cargarUsuario();
    this.url = global.url;
  }

  ngOnInit()
  {
    this.getCategorias();
  }

  ngDoCheck(){
    this.cargarUsuario();
    this.cargarCategorias();
  }

  cargarUsuario(){
        //Recupero la identidad del usuario autenticado para la vista
        this.identidad = this._usuarioService.getIdentidad();
        this.token = this._usuarioService.getToken();
  }

  cargarCategorias(){
    //Recupero las categorías almecenadas
    this.categorias = this._categoriaService.recuperarCategorias();
  }

  getCategorias(){
    this._categoriaService.getCategoriasNoVacias().subscribe(
      response => {
        if(response.estado == 'éxito'){
            this.categorias = response.categorias; 
            //Almaceno las categorías en el localstorage
            this._categoriaService.almacenarCategorias(this.categorias);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
