/**
 * Componente para la gestión de categorías
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { Categoria } from '../../modelos/categoria';
import { CategoriaService } from '../../servicios/categoria.service';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {

  public page_title: string;
  public identidad;
  public token;
  public categoria: Categoria;
  public categorias;
  public categoriaCreada: string;
  public estado: string;
  public mensaje;
  public editar_id;
  public editar_nombre;

  //Iconos
  public faEdit = faEdit;
  public faTrashAlt = faTrashAlt;

  //Inyecto los servicios en el constructor
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioServicio: UsuarioService,
    private _categoriaService: CategoriaService
  ) {
    this.page_title = "Categorias";

    //Recupero la identidad y el token del usuario logueado
    this.identidad = this._usuarioServicio.getIdentidad();
    this.token = this._usuarioServicio.getToken();

    //Creo un objeto vacío para la categoría
    this.categoria = new Categoria(1,'');

    //Inicializo a 0 la variable que controla qué categoría estoy editanto
    this.editar_id = 0;
   }

  //Cargo todas las categorías al iniciar el componente
  ngOnInit(): void {
    this.getCategorias();
  }

  /**
   * Método del formulario para crear una nueva categoría 
   */
  onSubmit(form){
    //Creo la categoría enviando la que se encuentra en el objeto 'categoria' vinculado al input
    this._categoriaService.crearCategoria(this.token, this.categoria).subscribe(
      response => {
        if(response.estado == 'éxito'){
          //Si la respuesta es exitosa asigno la categoría 
          this.categoria = response.categoria;
          this.estado = 'éxito';
          //Asigno el mensaje de respuesta para mostrarlo luego
          this.mensaje = response.mensaje;
          //Almaceno la categoría creada
          this.categoriaCreada = this.categoria.nombre;
          //Limpio el formulario
          form.reset();
          //Refresco las categorías
          this.getCategorias();
        }else{
          this.estado = 'error';
          this.mensaje = response.mensaje;
        }
      },
      error => {
        this.estado = 'error';
        this.mensaje = error.mensaje;
      }
    );
  }

  /**
   * Método que recupera todas las categorías
   */
  getCategorias(){
    this._categoriaService.getCategorias().subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.categorias = response.categorias;
        }
      },
      error => {
        this.estado = 'error';
        this.mensaje = error.mensaje;
      }
    );
  }

  /**
   * Método que edita una categoría por ID
   */
  editar(id){
    //Asigno la ID recibida a la variable editar_id para guardar cuál estoy editando
    this.editar_id = id;

    //Recorro todas las categorías
    this.categorias.forEach(categoria => {
      //Guardo el nombre de la categoría que voy a editar
      if(categoria.id == id) this.editar_nombre = categoria.nombre;
    });
  }

  /**
   * Método que guarda los cambios de la categoría editada
   */
  guardarCambios(categoria){
    //Le asigno a la categoría el nombre editado
    categoria.nombre = this.editar_nombre;

    //Actualizo la categoría
    this._categoriaService.actualizar(this.token, categoria).subscribe(
      response => {
        if(response.estado == 'éxito'){
          //Actualizo el estado y el mensaje
          this.estado = 'éxito';
          this.mensaje = response.mensaje;
          //Inicializo la id de la categoría a editar
          this.editar_id = 0;
          //Recargo las categorías
          this.getCategorias();

          //Recupero las categorías no vacías para actualizar el menú
          this._categoriaService.getCategoriasNoVacias().subscribe(
            response => {
              let categoriasNoVacias = response.categorias;
              //Almeceno las categorías para que estén actualizadas
              this._categoriaService.almacenarCategorias(categoriasNoVacias);
            }
          );
        }else{
          this.estado = 'error';
          this.mensaje = response.mensaje;
        }
      },
      error => {
        this.estado = 'error';
        this.mensaje = error.mensaje;
      }
    );
  }

  /**
   * Método que elimina una categoría por ID
   */
  eliminar(id){
    this._categoriaService.eliminar(this.token, id).subscribe(
      response => {
        this.estado = 'éxito';
        this.mensaje = response.mensaje;
        //Actualizo la categorías
        this.getCategorias();
      },
      error => {
        this.estado = 'error';
        this.mensaje = error.mensaje;
      }
    )
  }

}
