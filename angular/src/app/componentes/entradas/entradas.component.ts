import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { EntradaService } from '../../servicios/entrada.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { faEdit, faTrashAlt, faTimesCircle, faPlayCircle, faTrashRestoreAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Entrada } from '../../modelos/entrada';
import { global } from '../../servicios/global';
import { NgbNav} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css'],
  providers: [UsuarioService, EntradaService, CategoriaService, NgbNav]
})
export class EntradasComponent implements OnInit {

  public page_title: string;
  public identidad;
  public token;
  public entradas;
  active = 1;

  //Iconos
  public faEdit = faEdit;
  public faTrashAlt = faTrashAlt;
  public faTimesCircle = faTimesCircle;
  public faPlayCircle = faPlayCircle;
  public faTrashRestoreAlt = faTrashRestoreAlt;
  public faExclamationTriangle = faExclamationTriangle;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _entradaService: EntradaService,
    private _categoriaService: CategoriaService
  ) {
    
   }

  ngOnInit(): void {

    this.page_title = 'Entradas';
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Cargo todas las entradas
    this.getEntradas();
  }

  getEntradas(){
    this._entradaService.getEntradas().subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.entradas = response.entradas;
          console.log(this.entradas);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cambiaEstado(entrada, estado){
    //Asigno el nuevo estado a la entrada
    entrada.estado = estado;

    //Creo un JSON con los datos para actualizar el estaado
    let entradaAux = {"id" : entrada.id, "estado" : estado};
    
    //Actualizo al entrada
    this._entradaService.editar(this.token, entradaAux, entrada.id).subscribe(
      response => {
        console.log(response);
            //Actualizo las categorías almacenadas
            this._categoriaService.getCategoriasNoVacias().subscribe(
              response => {
                if(response.estado == 'éxito'){
                    let categorias = response.categorias; 
                    console.log(response.categorias);
                    //Almaceno las categorías en el localstorage
                    this._categoriaService.almacenarCategorias(categorias);
                }
              },
              error => {
                console.log(error);
              }
            );
      },
      error => {
        console.log(error);
      }
    );


  }

  eliminarDefinitivamente(id){
    this._entradaService.eliminar(this.token, id).subscribe(
      response => {
        console.log(response);
        this.getEntradas();
      },
      error => {
        console.log(error);
      }
    );
  }

}
