import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medio } from '../modelos/medio';
import { global } from './global';

//Clase del servicio para Medio
@Injectable()
export class MedioService{
    public url: string;
    public identidad;
    public token;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método para actualizar los datos del usuario en la BBDD
     * 
     * Recibe el token del usuario logueado y los datos del usuario en un objeto
     */
    actualizar(token, medio): Observable<any>{

        //Convierto el medi a JSON
        let json = JSON.stringify(medio);

        console.log(json);
        //Creo una cadena con los parámetros para la petición
        let parametros = "json="+json;

        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);
        
                                        
        //Devuelvo la petición AJAX para actualizar el medio por PUT
        return this._http.put(this.url+'medio', parametros, {headers: headers});
    }

    //Lista todos los medios
    getMedios():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todos los medios
        return this._http.get(this.url+'medios', {headers: headers});
    }

    //Lista un medio por ID
    getMedioById(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con el medio
        return this._http.get(this.url+'medio/id/' + id, {headers: headers});
    }

    borraMedio(token, id):Observable<any>{
    //Cabeceras HTTP. Envío además el token.
    let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                    .set('Authorization', token);

    //Devuelvo la petición AJAX para borrar el medio
    return this._http.delete(this.url+'medio/' + id, {headers: headers});
    }

    /**
     * Método que devuelve la identidad del usuario autenticado
     */
    getIdentidad(){

        //Recupero la identidad convirtiendo el JSON en un objeto
        let identidad = JSON.parse(localStorage.getItem('identidad'));

        //Me aseguro de que 'identidad' contiene datos
        if(identidad && identidad != "undefined"){
            this.identidad = identidad;
        }else{ //Si no recibo nada le asigno null
            this.identidad = null;
        }

        //Devuelvo la identidad
        return this.identidad;
    }

    /**
     * Método que devuelve el token del usuario autenticado
     */
    getToken(){
        //Recupero el token
        let token = localStorage.getItem('token');

        //Me aseguro de que contiene el token
        if(token && token!= "undefined"){
            this.token = token;
        }else{ //Si no le asigno null
            this.token = null;
        }

        //Devuelvo el token
        return this.token;
    }

    setMedioSeleccionado(id){
        localStorage.setItem('medioSeleccionadoID', id);
    }

    getMedioSeleccionado(){
        return localStorage.getItem('medioSeleccionadoID');
    }

    clearImagen(){
        localStorage.removeItem('medioSeleccionadoID');
    }

}

