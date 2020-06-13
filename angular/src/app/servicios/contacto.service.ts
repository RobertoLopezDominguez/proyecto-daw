/**
 * Servicio para las opraciones con los formularios de contacto
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

//Clase del servicio para Usuario
@Injectable()
export class ContactoService{
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método que crea un nuevo contacto
     * Recibe el objeto con el contacto a crear
     * Devuelve un Observable con la respuesta JSON del servidor
     */
    nuevo(contacto):Observable<any>{
        //Creo la cadena para enviar en la petición
        let  json = JSON.stringify(contacto);
        let parametros = "json="+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para enviar un nuevo contacto
        return this._http.post(this.url+'contacto', parametros, {headers: headers});
    }

    /**
     * Método para obtener todos los contactos
     * Recibe el token del usuario autenticado
     * Devuelve un Observable con la respuesta JSON del servidor
     */
    getContactos(token):Observable<any>{
        //Cabeceras HTTP. Incluye el token del usuario autenticado
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.get(this.url+'contactos', {headers: headers}); 
    }

    /**
     * Método para eliminar un contacto por ID
     * Recibe el token del usuario autenticado y la ID
     * Devuelve un Observable con la respuesta JSON del servidor
     */   
    eliminar(token, id):Observable<any>{
        //Cabeceras HTTP. Incluye el token del usuario autenticado
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para eliminar
        return this._http.delete(this.url+'contacto/' + id, {headers: headers}); 
    }
}