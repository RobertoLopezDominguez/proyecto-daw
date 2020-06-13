/**
 * Servicio para las operaciones con entradas
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable()
export class EntradaService{
    public url: string;

    constructor(
        private _http: HttpClient
    ){
        //URL para peticiones AJAX a Laravel
        this.url = global.url;
    }

    /**
     * Método para crear una entrada
     * Recibe el token del usuario y la entrada a crear
     */
    crear(token, entrada): Observable<any>{
        //Creo la cadena para enviar en la petición
        let json = JSON.stringify(entrada);
        let parametros = "json="+json;

        //Cabeceras HTTP con el token
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para dar de alta una nueva entrada
        return this._http.post(this.url+'entrada', parametros, {headers: headers});
    }

    /**
     * Método que devuelve todas las entradaa
     */
    getEntradas():Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todas las entradas
        return this._http.get(this.url+'entradas', {headers: headers});
    }

    /**
     * Método que devuelve todas las entradas publicadas
     */
    getEntradasPublicadas():Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todas las entradas
        return this._http.get(this.url+'entradaspublicadas', {headers: headers});
    }

    /**
     * Método que devuelve todas las entradas publicadas de una categoría
     * Recibe el ID de la categoría
     */
    getEntradasPublicadasByCategoria(id):Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todas las entradas
        return this._http.get(this.url+'entradaspublicadas/categoria/' + id, {headers: headers});
    }

    /**
     * Método que devuelve una entrada por su ID
     */
    getEntrada(id):Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con la entrada pasando el ID
        return this._http.get(this.url+'entrada/' + id, {headers: headers});
    }

    /**
     * Método para editar una entrada
     * Recibe el token, la entrada y el ID
     */
    editar(token, entrada, id): Observable<any>{
        //Copio el objeto 'entrada' para poder eliminar lo que no quiero enviar
        let entradaAux = JSON.parse(JSON.stringify(entrada));
        
        //Elimino las propiedades que no quiero enviar porque no corresponden al modelo entrada
        delete entradaAux.nombre;
        delete entradaAux.apellidos;
        delete entradaAux.categoria;
        delete entradaAux.imagen;

        //Formateo los parámetros a enviar
        let json = JSON.stringify(entradaAux);
        let parametros = "json="+json;

        //Cabeceras HTTP con el token
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX que devuelve la entrada a editar
        return this._http.put(this.url+'entrada', parametros, {headers: headers});
    }

    /**
     * Método que elimina una entrada por su ID
     */
    eliminar(token, id){
        //Cabeceras HTTP com el token del usuario autenticado
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);

        //Devuelvo la petición AJAX para borrar la entrada
        return this._http.delete(this.url+'entrada/'+id, {headers: headers});        
    }
}