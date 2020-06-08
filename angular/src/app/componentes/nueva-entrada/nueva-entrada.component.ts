import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { Entrada } from '../../modelos/entrada';
import { global } from '../../servicios/global';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { ThrowStmt } from '@angular/compiler';
import { Medio } from 'src/app/modelos/medio';
 

@Component({
  selector: 'app-nueva-entrada',
  templateUrl: './nueva-entrada.component.html',
  styleUrls: ['./nueva-entrada.component.css'],
  providers: [UsuarioService, CategoriaService, EntradaService, MedioService]
})
export class NuevaEntradaComponent implements OnInit, DoCheck {

  public page_title: string;
  public identidad;
  public token;
  public estado;
  public url;
  public entrada: Entrada;
  public medio: Medio;
  public categorias;
  public etiquetas: string[] = [];
  public etiquetaNueva;
  public faMinusCircle = faMinusCircle;
  public mediosVisible;
  public imagenNombre;

  //Opciones para el editor de texto enriquecido
  public opcionesFroala: Object = {
    placeholderText: 'Escribe la entrada aquí',
    height: 200
  };

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _categoriaService: CategoriaService,
    private _entradaService: EntradaService,
    private _medioService: MedioService
  ) {
    this.page_title = 'Nueva entrada';
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();
    //URL del API
    this.url = global.url;

    this.mediosVisible = false;
   }

  ngOnInit(): void {
    //Limpio el localStorage para asegurarme de que no hay ninguna imagen almacenada
    this._medioService.clearImagen();
    
    //Cargo las categorías
    this.getCategorias();

    //Creo un objeto de tipo Entrada para ir rellenándolo
    this.entrada = new Entrada(1,this.identidad.id,1,'Borrador','','',null,this.etiquetas);
    this.medio = new Medio(
      1, '', '', '', 'Publicada', '', '', '', '',null
    );
  }

  ngDoCheck(){
    this.compruebaImagen();
  }

  /**
   * Método que carga todas las categorías de la base de datos
   */
  getCategorias(){
    //Consulto las categorías por medio del servicio
    this._categoriaService.getCategorias().subscribe(
      response => {
        //Si todo ha ido bien asigno la respuesta a la variable 'categorías'
        if(response.estado == 'éxito'){
          this.categorias = response.categorias;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit(form){
    console.log(this.entrada);

    //Guardo el post en la base de datos
    this._entradaService.crear(this.token, this.entrada).subscribe(
      response => {
        if(response.estado = 'éxito'){
          this.entrada = response.entrada;
          this.estado = 'éxito';
          console.log(this.entrada);
        }else{
          this.estado = 'error';
        }
      },
      error => {
        console.log(error);
        this.estado = 'error';
      }
    )
  }

  /**
   * Método que añade una etiqueta
   */
  addEtiqueta(form){
    //Commpruebo que la etiquena no esté repetida ni esté en blanco
    if(this.etiquetas.indexOf(this.etiquetaNueva) < 0 && this.etiquetaNueva != null){
      //Si la etiqueta no existe la añado
      this.etiquetas.push(this.etiquetaNueva);
    }

    //Reseteo el formulario
    form.reset();
  }

  /**
   * Método  que elimima una etiqueta
   * 
   * Recibe el evento del formulario
   */
  borraEtiqueta(event: any){
    //Recupero el índice de la etiqueta a borrar del input oculto
    let indice = event.target.indice.value;
    //Elimino la etiqueta del array
    this.etiquetas.splice(indice,1);
  }

  toggleMedios(){
    this.mediosVisible = !this.mediosVisible;
    console.log(this.mediosVisible);
  }

  compruebaImagen(){
      this.entrada.imagen_id = this._medioService.getMedioSeleccionado()['id'];
      if(this.entrada.imagen_id != null){
        this.medio.nombre = this._medioService.getMedioSeleccionado()['nombre'];
      }
  }

  eliminaImagen(){
    this.entrada.imagen_id = null;
    this._medioService.clearImagen();
  }

  cambiaEstado(){}

}
