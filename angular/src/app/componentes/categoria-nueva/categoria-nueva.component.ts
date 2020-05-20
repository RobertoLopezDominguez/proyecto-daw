import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { Categoria } from '../../modelos/categoria';
import { CategoriaService } from '../../servicios/categoria.service';


@Component({
  selector: 'app-categoria-nueva',
  templateUrl: './categoria-nueva.component.html',
  styleUrls: ['./categoria-nueva.component.css'],
  providers: [UsuarioService, CategoriaService]
})
export class CategoriaNuevaComponent implements OnInit {

  public page_title: string;
  public identidad;
  public token;
  public categoria: Categoria;
  public categorias;
  public estado: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioServicio: UsuarioService,
    private _categoriaService: CategoriaService
  ) {
    this.page_title = "Crear nueva categoría";

    this.identidad = this._usuarioServicio.getIdentidad();
    this.token = this._usuarioServicio.getToken();
    this.categoria = new Categoria(1,'');

   }

  ngOnInit(): void {
    this.getCategorias();
  }

  onSubmit(form){
    this._categoriaService.crearCategoria(this.token, this.categoria).subscribe(
      respose => {
        if(respose.estado == 'éxito'){
          this.categoria = respose.categoria;
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

  getCategorias(){
    this._categoriaService.getCategorias().subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.categorias = response.categorias;
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
