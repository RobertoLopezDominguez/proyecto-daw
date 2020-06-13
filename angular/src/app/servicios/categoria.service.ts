/**
 * Servcio para las operaciones con caegorías
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../modelos/categoria';
import { global } from './global';

//Clase del servicio para Usuario
@Injectable()
export class CategoriaService{
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método que crea una categoría nueva.
     * Recibe el token del usuario autenticado y la categoría
     * Devuelve la respuesta JSON del servidor en un Observable
     */
    crearCategoria(token, categoria): Observable<any>{
        //Convierto el objeto a una cadena JSON que poder enviar
        let  json = JSON.stringify(categoria);
        //Creo la cadena que voy a enviar en la petición
        let parametros = "json="+json;

        //Cabeceras HTTP. Envío el token
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.post(this.url+'categoria', parametros, {headers: headers});
    }

    /**
     * Método que recupera todas las categorías
     * Devuelve la respuesta JSON del servidor en un Observable
     */
    getCategorias():Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.get(this.url+'categorias', {headers: headers});
    }

    /**
     * Método que recupera todas las categorías que contengan alguna entrada publicada.
     * Devuelve la respuesta JSON del servidor en un Observable
     */
    getCategoriasNoVacias():Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con las categorías no vacías (con alguna entrada publicada)
        return this._http.get(this.url+'categoriasnovacias', {headers: headers});
    }

    /**
     * Método que almacenas las categorías en el localStorage
     */
    almacenarCategorias(categorias){
        //Limpio el ítem
        localStorage.removeItem('categorias');
        //Las guardo en el LocalStorage
        localStorage.setItem('categorias', JSON.stringify(categorias));
    }

    /**
     * Método que recupera las categorías del localStorage
     */
    recuperarCategorias(){
        //Recupero las categorías
        let categorias = localStorage.getItem('categorias');
        //Las devuelvo convertidas en objeto
        return JSON.parse(categorias);
    }

    /**
     * Método que elimina una categoría por ID
     * Devuelve la respuesta JSON del servidor en un Observable
     */
    eliminar(token, id):Observable<any>{
        //Cabeceras HTTP. Envío el token
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX para eliminar la categoría por el ID
        return this._http.delete(this.url+'categoria/'+id, {headers: headers});        
    }

    /**
     * Método que actualia una categoría
     * Devuelve la respuesta JSON del servidor en un Observable
     */
    actualizar(token, categoria):Observable<any>{
        //Creo la cadena que voy a enviar en la petición
        let  json = JSON.stringify(categoria);
        let parametros = "json="+json;

        //Cabeceras HTTP con el token
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para actualizar una categoría
        return this._http.put(this.url+'categoria', parametros, {headers: headers});
    }
}