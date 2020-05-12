<?php

namespace App\Http\Middleware;

use Closure;

class ApiAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        //Compruebo si el usuario está autenticado
        //Capturo el token que se habrá enviado en el header HTTP 'Authorization'
        $token = $request->header('Authorization');

        //Creo un nuevo objeto de mi helper JwtAuth y compruebo el token
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        
        //Si el token es correcto pasamos la petición al controlador correspondiente
        if($checkToken){
            return $next($request);
        }else{ //Si no, devolvemos un error
            $respuesta = array(
                'codigo' => 400,
                'estado' => 'error',
                'mensaje' => 'El usuario no está identificado.'
            ); 
            return response()->json($respuesta, $respuesta['codigo']);
        }
    }
}
