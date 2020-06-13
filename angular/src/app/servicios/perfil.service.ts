/**
 * Método para las operaciones con los perfiles
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

//Clase del servicio para Perfil
@Injectable()
export class PerfilService{

    public url: string;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método que recupera todos los perfiles
     */
    getPerfiles():Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todos los perfies
        return this._http.get(this.url+'perfiles', {headers: headers});
    }

    /**
     * Método que recupera un perfil por ID
     */
    getPerfil(token, id):Observable<any>{
        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX con el perfil
        return this._http.get(this.url+'perfil/' + id, {headers: headers});
    }
}