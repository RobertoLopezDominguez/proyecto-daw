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

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioServicio: UsuarioService,
    private _categoriaService: CategoriaService
  ) {
    this.page_title = "Categorias";

    this.identidad = this._usuarioServicio.getIdentidad();
    this.token = this._usuarioServicio.getToken();
    this.categoria = new Categoria(1,'');

    this.editar_id = 0;

   }

  ngOnInit(): void {
    this.getCategorias();
  }

  onSubmit(form){
    this._categoriaService.crearCategoria(this.token, this.categoria).subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.categoria = response.categoria;
          this.estado = 'éxito';
          this.mensaje = response.mensaje;
          this.categoriaCreada = this.categoria.nombre;
          form.reset();
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

  editar(id){
    this.editar_id = id;

    this.categorias.forEach(categoria => {
      if(categoria.id == id) this.editar_nombre = categoria.nombre;
    });
  }

  guardarCambios(categoria){
    categoria.nombre = this.editar_nombre;
    this._categoriaService.actualizar(this.token, categoria).subscribe(
      response => {
        if(response.estado == 'éxito'){
          console.log(response);
          this.estado = 'éxito';
          this.mensaje = response.mensaje;
          this.editar_id = 0;
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

  eliminar(id){
    this._categoriaService.eliminar(this.token, id).subscribe(
      response => {
        this.estado = 'éxito';
        this.mensaje = response.mensaje;
        this.getCategorias();
      },
      error => {
        this.estado = 'error';
        this.mensaje = error.mensaje;
      }
    )
  }

}
