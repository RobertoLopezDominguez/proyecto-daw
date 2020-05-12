<?php
namespace App\Helpers;

use Firebase\JWT\JWT; //Usamos la libreria JWT del paquete Firebase
use Illuminate\Support\Facades\DB; //Para hacer consultas a la base de datos
use App\Usuario;
use Illuminate\Http\Response;

//Helper para la autenticación de usuarios
class JwtAuth{

    //Variable para la clave para codificar el token
    public $key;

    public function __construct(){
        //Creo en el constructor la key para codificar el token
        $this->key = 'Clave_para_codificar_el_token_solo_quien_la_tenga_puede_decodificarlo_$%&34567';
    }

    //Función para autenticar que recibe el usuario y el password
    //El tercer parámetro indica si devolver el usuario o el token
    public function signup($usuario, $password, $getToken = null){

        //Busco el usuario en la base de datos
        $usuario = Usuario::where([
            'usuario' => $usuario,
            'password' => $password
        ])->first();

        //Compruebo si las credenciales son correctas
        $signup = false; //Por defecto la autenticación es falsa

        //Si el usuario se ha encontrado la autenticación es correcta
        if(\is_object($usuario)) $signup = true;

        //Genero un token para el usuario identificado
        if($signup){ //Solo si se ha encontrado el usuario

            //Tiempo de caducidad del token en segundos (7 días). Dato 'exp' de Jwt
            $tiempo_caducidad = 7 * 24 * 60 * 60; //Dias * Horas * Minutos * Segundos

            //Datos para generar el token
            $token = array(
                'id'            =>  $usuario->id,
                'usuario'      =>  $usuario->usuario,
                'email'         =>  $usuario->email,
                'perfil'        =>  $usuario->perfil->nombre,
                'nivel_acceso'  =>  $usuario->perfil->nivel_acceso,
                'nombre'        =>  $usuario->nombre,
                'apellidos'     =>  $usuario->apellidos,
                'imagen'        =>  $usuario->imagen,
                'iat'           =>  time(),
                'exp'           =>  time() + $tiempo_caducidad
            );  

            $jwt = JWT::encode($token, $this->key, 'HS256'); //Token codificado
            $descodificado = JWT::decode($jwt, $this->key, ['HS256']); //Token descodificado

            //Devolver los datos del usuario o el token según el caso en función del parámetro getToken
            if(is_null($getToken)){ 
                $respuesta = $jwt;
            }else{
                $respuesta = $descodificado;
            }

        }else{
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'Login incorrecto.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return $respuesta;
    }

    /**
     * Función para comprobar el token
     * 
     * Recibe el token y opcionalmente un parámetro para optener la identidad del usuario
     */
    public function checkToken($jwt, $getIdentidad = false){

        //La autenticación será false por defecto
        $auth = false;

        //Decodificamos el token
        try{
            $token_decodificado = JWT::decode($jwt, $this->key, ['HS256']);
        }catch(\UnexpectedValueException $e){
            $auth = false;
        }catch(\DomainException $e){
            $auth = false;
        }
        
        //Si todo está correcto devolvemos true
        if(!empty($token_decodificado) && is_object($token_decodificado) && isset($token_decodificado->id)){
            $auth = true;
        }else{
            $auth = false;
        }

        //Si se ha recibido el parámetro getIdentidad devolvemos el token decodificado
        if($getIdentidad){
            return $token_decodificado;
        }

        //Devolvemos el resultado de la autenticación
        return $auth;
    }

}