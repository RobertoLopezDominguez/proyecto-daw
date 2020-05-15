import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { global } from './global';

//Clase del servicio para Usuario
@Injectable()
export class UsuarioService{
    public url: string;
    public identidad;
    public token;

    constructor(
        public _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método para registrar un usuario
     * 
     * Recibe un objeto de tipo Usuario con los datos del mismo
     * 
     * Devuelve un Observable 
     */
    registro(usuario): Observable<any>{
        //Convierto el objeto usuario a JSON
        let json = JSON.stringify(usuario);

        //Cadena de parámetros a enviar al API
        let parametros = 'json='+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para regitrar un usuario
        return this._http.post(this.url+'registro', parametros, {headers: headers});
    }

    /**
     * Método que devuelve los datos del usuario autenticado
     * o el token
     * 
     * Recibe un objeto de tipo Usuario y un parámetro gettoken
     * que determisa si se devuelve el token en caso de existir
     * 
     * Devuelve un Observable
     */
    signup(usuario, gettoken = null): Observable<any>{

        //Compruebo si está el parámetro gettoken
        if(gettoken != null){
            usuario.gettoken = 'true'; //Marco la propiedad como true
        }

        //Convierto el objeto a JSON y creo la cadena a enviar por HTTP
        let json = JSON.stringify(usuario);
        let parametros = 'json='+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para autenticar un usuario
        return this._http.post(this.url+'login', parametros, {headers: headers});
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
}