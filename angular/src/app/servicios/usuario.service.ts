import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../modelos/usuario';
import { global } from './global';

//Clase del servicio para Usuario
@Injectable()
export class UsuarioService{
    public url: string;
    public identity;
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
        console.log(parametros);

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para regitrar un usuario
        return this._http.post(this.url+'registro', parametros, {headers: headers});
    }

}