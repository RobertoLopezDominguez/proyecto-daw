import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con todos los medios
        return this._http.get(this.url+'medios', {headers: headers});
    }

    //Lista un medio por ID
    getMedioById(id):Observable<any>{
        //Cabeceras HTTP
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

        //Devuelvo la petición AJAX con el medio
        return this._http.get(this.url+'medio/id/' + id, {headers: headers});
    }

    //Elimina un medio por ID
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

    /**
     * Método que guarda el medio seleccionado en el localStorage
     * Recibe la ID del medio
     */
    setMedioSeleccionado(id){

        //Almaceno la ID de la imagen
        localStorage.setItem('medioSeleccionadoID', id);

        //Recupero el nombre de la imagen seleccionada
        this.getMedioById(id).subscribe(
            response => {
                if(response.estado == 'éxito'){
                    //Almaceno el nombre del medio en el localStorage
                    localStorage.setItem('medioSeleccionadoNombre', response.medio.nombre);
                }
            },
            error => {
                console.log(error);
            }
        );
    }

    /**
     * Método que recupera el medio seleccionado del localStorage
     */
    getMedioSeleccionado(){
        //Creo un array para almacenarlo
        let medioSeleccionado = [];

        //Recupero el id y el nombre del medio del localStorage
        medioSeleccionado['id'] = localStorage.getItem('medioSeleccionadoID');
        medioSeleccionado['nombre'] = localStorage.getItem('medioSeleccionadoNombre');
        
        //Devuelvo el array
        return medioSeleccionado;
    }

    //Método que elimina el medio guardado en el localStorage
    clearImagen(){
        //Elimino las claves del localStorage
        localStorage.removeItem('medioSeleccionadoID');
        localStorage.removeItem('medioSeleccionadoNombre');
    }

}

