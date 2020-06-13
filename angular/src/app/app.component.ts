/**
 * Componente principal de la aplicación
 */
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
    //Cargo el usuario autenticado
    this.cargarUsuario();
    //URL base para las peticiones al servidor
    this.url = global.url;
  }

  ngOnInit()
  {
    //Recupero las categorías al inicio del componente para mostrarlas en el menú
    this.getCategorias();
  }

  ngDoCheck(){
    //Compruebo periódicamente el usuario y las categorías
    this.cargarUsuario();
    this.cargarCategorias();
  }

  /**
   * Método que recupera la identidad y el token del usuario
   */
  cargarUsuario(){
        //Recupero la identidad del usuario autenticado para la vista
        this.identidad = this._usuarioService.getIdentidad();
        this.token = this._usuarioService.getToken();
  }

  /**
   * Método que carga las categorías para el menú
   */
  cargarCategorias(){
    //Recupero las categorías almecenadas en el localStorage
    this.categorias = this._categoriaService.recuperarCategorias();
  }

  /**
   * Método que recupera las categorías no vacías de la BBDD
   */
  getCategorias(){
    //Recupero las categorías llamando al servicio
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
