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
        private _http: HttpClient
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

        //Devuelvo la petición AJAX para autenticar un usuario por PSOT
        return this._http.post(this.url+'login', parametros, {headers: headers});
    }

    /**
     * Método para actualizar los datos del usuario en la BBDD
     * 
     * Recibe el token del usuario logueado y los datos del usuario en un objeto
     */
    actualizar(token, usuario): Observable<any>{

        //Creo una copia del objeto usuario para poder eliminar los campos
        //que voy a enviar en la petición sin que afecte al objeto original
        let usuario_actualizado = JSON.parse(JSON.stringify(usuario)); 

        //Recupero el usuario autenticado
        let identidad = this.getIdentidad();

        //Compruebo si los campos únicos de 'usuario' y 'email' se han actualizado
        if(identidad.usuario == usuario.usuario){
            //Si el campo no se ha actualizado lo elimino para no enviarlo en la petición
            //De esta forma se evita el error de que el campo ya existe
            delete usuario_actualizado.usuario;
        }
        if(identidad.email == usuario.email){ //Misma operación para el email
            delete usuario_actualizado.email;
        }

        //Elimino el parámetro de la password que no quiero actualizar
        //delete usuario_actualizado.password;
        delete usuario_actualizado.created_at;
        delete usuario_actualizado.updated_at;

        //Convierto los datos del usuario de un objeto a JSON
        let json = JSON.stringify(usuario_actualizado);

        console.log(json);
        //Creo una cadena con los parámetros para la petición
        let parametros = "json="+json;

        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
                                        .set('Authorization', token);
        
                                        
        //Devuelvo la petición AJAX para actualizar el usuario por PUT
        return this._http.put(this.url+'usuario', parametros, {headers: headers});
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
     * Método que devuelve todos los usuarios
     */
    getUsuarios(token): Observable<any>{
        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX para obtener todos los usuarios
        return this._http.get(this.url+'usuarios', {headers: headers});
    }

    getUsuarioById(token,id):Observable<any>{
        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX para obtener todos los usuarios
        return this._http.get(this.url+'usuario/' + id, {headers: headers});
    }

    eliminar(token, id): Observable<any>{
        //Cabeceras HTTP. Envío además el token.
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', token);

        //Devuelvo la petición AJAX para eliminar el usuario
        return this._http.delete(this.url+'usuario/' + id, {headers: headers});
    }
}