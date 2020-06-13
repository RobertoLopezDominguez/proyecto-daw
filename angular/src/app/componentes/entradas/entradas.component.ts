/**
 * Componente para gestionar las entradas
 */
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { EntradaService } from '../../servicios/entrada.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { faEdit, faTrashAlt, faTimesCircle, faPlayCircle, faTrashRestoreAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { NgbNav} from '@ng-bootstrap/ng-bootstrap'; //Para las pestañas

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
  public active = 1; //Indica qué pestaña está activa

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
    this.page_title = 'Entradas';
    //Cargo los datos del usuario autenticado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();
  }

  ngOnInit(): void {
    //Cargo todas las entradas
    this.getEntradas();
  }

  //Método que recupera todas las entradas
  getEntradas(){
    this._entradaService.getEntradas().subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.entradas = response.entradas;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  //Métooo que cambia el estado de una entrada (Publicada, Borrador, Papelera)
  cambiaEstado(entrada, estado){
    //Asigno el nuevo estado a la entrada
    entrada.estado = estado;

    //Creo un JSON con los datos para actualizar el estaado
    let entradaAux = {"id" : entrada.id, "estado" : estado};
    
    //Actualizo al entrada
    this._entradaService.editar(this.token, entradaAux, entrada.id).subscribe(
      response => {
            //Actualizo las categorías almacenadas
            this._categoriaService.getCategoriasNoVacias().subscribe(
              response => {
                if(response.estado == 'éxito'){
                    let categorias = response.categorias; 
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

  //Método que elimina una entrada
  eliminarDefinitivamente(id){
    this._entradaService.eliminar(this.token, id).subscribe(
      response => {
        //Actualizo las entradas después de borrar
        this.getEntradas();
      },
      error => {
        console.log(error);
      }
    );
  }

}
