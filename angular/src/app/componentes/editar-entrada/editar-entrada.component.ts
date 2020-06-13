/**
 * Componente para editar una entrada
 */
import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { CategoriaService } from '../../servicios/categoria.service';
import { EntradaService } from '../../servicios/entrada.service';
import { MedioService } from '../../servicios/medio.service';
import { Entrada } from '../../modelos/entrada';
import { Medio } from 'src/app/modelos/medio';
import { global } from '../../servicios/global';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
 
//Este componente usa la vista de nueva-entrada
@Component({
  selector: 'app-editar-entrada',
  templateUrl: '../nueva-entrada/nueva-entrada.component.html',
  styleUrls: ['../nueva-entrada/nueva-entrada.component.css'],
  providers: [UsuarioService, CategoriaService, EntradaService, MedioService]
})
export class EditarEntradaComponent implements OnInit, DoCheck {

  public page_title: string;
  public identidad;
  public token;
  public estado;
  public medio;
  public url;
  public entrada: Entrada;
  public categorias;
  public etiquetas: string[] = [];
  public etiquetaNueva;
  public faMinusCircle = faMinusCircle;
  public mediosVisible = false;
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
    this.page_title = 'Editar entrada';

    //Recupero la identidad y el token del usuario autenticado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //URL del API
    this.url = global.url;
  }

  //Se ejecuta al inicio del componente
  ngOnInit(): void {
    //Limpio el localStorage para asegurarme de que no hay ninguna imagen almacenada
    this._medioService.clearImagen();

    //Creo un objeto de tipo Entrada para ir rellenándolo
    this.entrada = new Entrada(1,null,1,'Borrador','','',null,this.etiquetas);
    this.medio = new Medio( 1, '', '', '', 'Publicada', '', '', '', '',null);

    //Recupero la entrada
    this.getEntrada();

    //Recupero las categorías
    this.getCategorias();
  }

  //Compuebo periódicamente el estado de la imagen
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

  //Recupera la entrada para la edicón
  getEntrada(){
    //Recupero el Id de la entrada de la URL
    this._route.params.subscribe(
      params => {
        let id = params['id'];

        //Petición AJAX para recuperar el post en cuestión
        this._entradaService.getEntrada(id).subscribe(
          response => {
            if(response.estado == 'éxito'){
              //Recupero la entrada
              this.entrada = response.entrada;
              //Compruebo si el usuario puede editar esta entrada, si no  puede redirijo a Inicio
              if(!this.compruebaAcceso(this.entrada)) this._router.navigate(['/inicio']);
              //Recupero las etiquetas
              this.etiquetas = this.entrada.etiquetas;
              //Almaceno la imagen seleccionada
              this._medioService.setMedioSeleccionado(response.entrada.imagen_id);
            }
          },
          error => { 
            console.log(error);
            this._router.navigate(['/inicio']);
          }
        );
      });
  }

  onSubmit(form){
    //Guardo el post en la base de datos
    this._entradaService.editar(this.token, this.entrada, this.entrada.id).subscribe(
      response => {
        if(response.estado = 'éxito'){
          //Actualizo la entrada
          this.getEntrada();
          this.estado = 'éxito';
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

  //Cambia la visibilidad del componente de Medios
  toggleMedios(){
    this.mediosVisible = !this.mediosVisible;
  }

  //Elimina la imagen seleccionada
  eliminaImagen(){
    this.entrada.imagen_id = null;
    this._medioService.clearImagen();
  }

  //Cambia el estado de la entrada
  cambiaEstado(){
    if(this.entrada.estado == 'Borrador'){
      this.entrada.estado = 'Publicada';
    }else{
      this.entrada.estado = 'Borrador';
    }
  }

  //Comprueba si hay una imagen seleccionda
  compruebaImagen(){
    //Compruebo si hay una imagen seleccionada para la edición
    if(this._medioService.getMedioSeleccionado()['id'] != "undefined"){
      //En ese caso la asigno al objeto entrada
      this.entrada.imagen_id = this._medioService.getMedioSeleccionado()['id'];
    }
    
    //Si el objeto tiene una imagen asociada
    if(this.entrada.imagen_id != null){
      this.medio.nombre = this._medioService.getMedioSeleccionado()['nombre'];
    }
  } 

  //Comprueba si el usuario puede editar esta entrada
  compruebaAcceso(entrada){
    console.log(entrada);
    //Compruebo si el usuario autenticado es administrador
    if(this.identidad.perfil == 'Administador'){
      return true;
    }else{ //Si no es administrador
      //Compruebo que sea el autor de la entrada
      if(this.identidad.id == entrada.usuario_id){
        return true;
      }else{
        return false;
      }
    }
  }
}

