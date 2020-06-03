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

    crearCategoria(token, categoria): Observable<any>{
        let  json = JSON.stringify(categoria);
        let parametros = "json="+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.post(this.url+'categoria', parametros, {headers: headers});
    }

    getCategorias():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.get(this.url+'categorias', {headers: headers});
    }

    eliminar(token, id):Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.delete(this.url+'categoria/'+id, {headers: headers});        
    }

    actualizar(token, categoria):Observable<any>{
        let  json = JSON.stringify(categoria);
        let parametros = "json="+json;

        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva categoría
        return this._http.put(this.url+'categoria', parametros, {headers: headers});
    }
}