/**
 * Guard para garantizar el acceso al perfil Editor
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UsuarioService } from './usuario.service';

@Injectable()
export class EditorGuard implements CanActivate{

    constructor(
        private _router: Router,
        private _usuarioService: UsuarioService
    ){}

    canActivate(){

        //Recupero la identidad del usuario y el token
        let identidad = this._usuarioService.getIdentidad();

        //Si 'identidad' existe es que el usuario está logueado
        if(identidad.nivel_acceso <= 100){ // 100 corresponde a Editor
            return true;
        }else{//si la respuesta es negativa
            //Redirijo a la página de inicio
            this._router.navigate(['/inicio']);
            //Devuelvo false para negar el acceso
            return false;
        }
        
    }
}