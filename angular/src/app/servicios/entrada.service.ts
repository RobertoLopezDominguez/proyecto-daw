import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrada } from '../modelos/entrada';
import { global } from './global';

//Clase del servicio para Usuario
@Injectable()
export class EntradaService{
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    crear(token, entrada): Observable<any>{
        let json = JSON.stringify(entrada);
        let parametros = "json="+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.post(this.url+'entrada', parametros, {headers: headers});
    }

    getEntradas():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todas las entradas
        return this._http.get(this.url+'entradas', {headers: headers});
    }

    getEntrada(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con la entrada pasando el ID
        return this._http.get(this.url+'entrada/' + id, {headers: headers});
    }

    editar(token, entrada, id): Observable<any>{
        let json = JSON.stringify(entrada);
        console.log(json);
        let parametros = "json="+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX que devuelve la entrada a editar
        return this._http.put(this.url+'entrada', parametros, {headers: headers});
    }

    eliminar(token, id){
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX que devuelve la entrada a editar
        return this._http.delete(this.url+'entrada/'+id, {headers: headers});        
    }
}