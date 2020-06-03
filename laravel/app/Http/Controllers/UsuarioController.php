<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Usuario;

class UsuarioController extends Controller
{
    
    public function __construct() {

        //Añado el middleware de autenticación a todos los métodos salvo las excepciones
        $this->middleware('api.auth', [
            'except' => ['registro','mostrar', 'login', 'getImagenByNombre']
        ]);
    } 

    /**
     * Función que registra un usuario nuevo
     *
     * Método HTTP: POST
     * Ruta: /api/usuario
     */
    public function registro(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un array
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'usuario'       => 'required|alpha_dash|max:50|unique:usuarios',
            'email'         => 'required|email|max:255|unique:usuarios',
            'perfil_id'     => 'required|numeric',
            'password'      => 'required|max:255',
            'estado'        => 'required|alpha|max:50',
            'nombre'        => 'max:50',
            'apellidos'     => 'max:255',
            'imagen'        => 'alpha_dash|max:255'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'El usuario no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta al usuario

            //Ciframos la contraseña
            $pwd_cifrada = hash('sha256', $parametros_array['password']);

            //Creamos un nuevo usuario
            $usuario = new Usuario();

            //Asignamos al usuario los valores requeridos que han llegado
            $usuario->usuario = $parametros_array['usuario'];
            $usuario->email = $parametros_array['email'];
            $usuario->perfil_id = $parametros_array['perfil_id'];
            $usuario->password = $pwd_cifrada;
            $usuario->estado = $parametros_array['estado'];

            //Asignamos el resto de valores según hayan llegado o no
            if(isset($parametros_array['nombre'])) $usuario->nombre = $parametros_array['nombre'];
            if(isset($parametros_array['apellidos'])) $usuario->apellidos = $parametros_array['apellidos'];
            if(isset($parametros_array['imagen'])) $usuario->imagen = $parametros_array['imagen'];

            //Guardamos el usuario en la base de datos
            $guardar_usuario = $usuario->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_usuario){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'El usuario se ha creado correctamente.',
                    'resultado' => $guardar_usuario
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_usuario
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que muestra un usuario buscando por un registro único
     * 
     * Recibe un JSON con dos clave: 'atributo' y 'valor'
     * 
     * Atributros posibles: id, usuario y email
     * 
     * Método HTTP: GET
     * Ruta: /api/usuario
     */
    public function mostrar(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un array
        $parametros_array = json_decode($json, true);

        switch($parametros_array['atributo']){
            case 'id': 
                //Recuperamos el usuario bucado por ID
                $usuario = Usuario::find($parametros_array['valor']);  
            break;
            case 'usuario': 
                //Recuperamos por el campo 'usuario'
                $usuario = Usuario::firstwhere('usuario', $parametros_array['valor']);
            break;
            case 'email': 
                //Recuperamos por el campo 'email'
                $usuario = Usuario::firstwhere('email', $parametros_array['valor']);
            break;
        }

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($usuario)){

            //Devuelvo un códido de éxito y el usuario
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Usuario encontrado.',
                'usuario' => $usuario
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'El usuario no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que devuelve un usuario por ID
     */
    public function getUsuarioById($id){
        //Recuperamos el usuario bucado por ID
        $usuario = Usuario::find($id); 

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($usuario)){

            //Devuelvo un códido de éxito y el usuario
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Usuario encontrado.',
                'usuario' => $usuario
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'El usuario no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza un usuario ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * No se pueden enviar 'usuario' e 'email' si no se van a modificar
     * 
     * Método HTTP: PUT
     * Ruta: /api/usuario
     */
    public function actualizar(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un array
        $parametros_array = json_decode($json, true);

        //Si los datos no están vacíos actualizo el registro
        if(!empty($parametros_array)){

            //Valido los datos recibidos
            $validar = \Validator::make($parametros_array, [
                'id'            => 'required|numeric',
                'usuario'       => 'alpha_dash|max:50|unique:usuarios',
                'email'         => 'email|max:255|unique:usuarios',
                'perfil_id'     => 'numeric',
                'password'      => 'max:255',
                'estado'        => 'alpha|max:50',
                'nombre'        => 'max:50',
                'apellidos'     => 'max:255',
                'imagen'        => 'max:255'
            ]); 

            //Compruebo si la validación ha fallado
            if($validar->fails()){

                //En caso de fallo devuelvo una respuesta con el error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 400,
                    'mensaje' => 'Los datos enviados no son correctos.',
                    'errores' => $validar->errors()
                );

            }else{ //Si a validación es correcta procedo a actualizar el usuario

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);
                unset($parametros_array['remember_token']);

                //Si ha llegado el password lo codifico
                if(isset($parametros_array['password'])){
                    $pwd_cifrada = hash('sha256', $parametros_array['password']);
                    $parametros_array['password'] = $pwd_cifrada;
                }

                //Actualizo el usuario en la base de datos
                $actualizar_usuario = Usuario::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_usuario){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Usuario actualizado correctamente.',
                        'cambios'  => $parametros_array,
                        'resultado' => $actualizar_usuario
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_usuario
                    );
                }
            }
        }else{

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'No se han encontrado datos.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que elimina un usuario
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/usuario/{id}
     */
    public function borrar($id){
        
        //Si ha llegado una ID borramos el registro
        if(isset($id)){
            $borrar_usuario = Usuario::destroy($id);

            //Si la operación se ha realizado envío una respuesta de éxito
            if($borrar_usuario){

                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'Usuario borrado correctamente.',
                    'resultado' => $borrar_usuario
                );
            }else{ //Si no muestro un mensaje de error

                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al borrar el usuario.',
                    'resultado' => $borrar_usuario
                );
            }
        }else{ //Si no se ha recibido el ID

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'No se ha recibido el ID.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función para hacer login de usuario
     * 
     * Recibe un JSON con el usuario y la password y opcionalmente gettoken
     * 
     * Método HTTP: POST
     * Ruta: /api/login
     */
    public function login(Request $request){

        //Creo un nuevo objeto de la clase JwtAuth para la autenticación
        $jwtAuth = new \JwtAuth();

        //Recojo los datos de recibidos por POST
        $json = $request->input('json', null);
        $parametros_objeto = json_decode($json);
        $parametros_array = json_decode($json, true);

        //Valido los datos
        $validar = \Validator::make($parametros_array, [
            'usuario'       => 'required',
            'password'         => 'required'
        ]); 

        //Si la validación falla
        if($validar->fails()){
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'El usuario no se ha podido autenticar.',
                'errores' => $validate->errors()
            );
        }else{ //Si la validación es correcta

            //Cifro la contraseña
            $pwd_cifrada = hash('sha256', $parametros_array['password']);

            //Devuelvo los datos del usuario o el token, según el caso
            if(!empty($parametros_array['gettoken'])){
                $respuesta = $jwtAuth->signup($parametros_array['usuario'], $pwd_cifrada, true);
            }else{
                $respuesta = $jwtAuth->signup($parametros_array['usuario'], $pwd_cifrada);
            }
    
        }

        //Devolvemos el resultado del login
        return response()->json($respuesta);
    }


    /**
     * Método para subir una imagen de usuario
     * 
     * Recibe una imagen llamada 'file0'
     */
    public function cargarImagen(Request $request){

        //Cargo el token del usuario autenticado
        $token = $request->header('Authorization');
        //Recupero la ID del usuario autenticado
        $usuario = $this->getUsuarioByToken($token);

        //Recojo la imagen de la petición
        $imagen = $request->file('file0'); 

        //Valido que el archivo sea una imagen
        $validar = \Validator::make($request->all(), [
            'file0' => 'required|image|mimes:jpg,jpeg,png,gif'
        ]);

        //Compruebo que la imagen ha llegado y es válida
        if($imagen && !$validar->fails()){

            //Creo un nombre para la imagen añadiendo la hora actual al nombre original
            $nombre_imagen = time()."_".$imagen->getClientOriginalName();

            //Guardo el fihero en el disco 'usuarios'
            \Storage::disk('usuarios')->put($nombre_imagen, \File::get($imagen));
            //Actualizo el nombre de la imagen en el modelo del usuario
            Usuario::where('id', $usuario->id)->update(['imagen' => $nombre_imagen]);

            $respuesta = array(
                'codigo' => 200,
                'estado' => 'éxito',
                'imagen' => $nombre_imagen
            );


        }else{ //Si no llega devuelco un error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'No es una imagen válida.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Método que devuelve la imagen del usuario
     */
    public function getImagen(Request $request) {

        //Cargo el token del usuario autenticado
        $token = $request->header('Authorization');
        //Recupero la ID del usuario autenticado
        $usuario = $this->getUsuarioByToken($token);

        //Compruebo que el archivo existe
        $isset = \Storage::disk('usuarios')->exists($usuario->imagen);

        //Si existe
        if ($isset) {
            //Recupero la imagen
            $file = \Storage::disk('usuarios')->get($usuario->imagen);

            //Devuelvo la imagen
            return new Response($file, 200);
        } else { //Si no existe devuelvo un error
            $respuesta = array(
                'codigo' => 400,
                'estado' => 'error',
                'mensaje' => 'La imagen no existe.'
            );
        }

        //Devuelvo la respuesta si ha habido error
        return response()->json($respuesta, $respuesta['codigo']);
    }

    public function getImagenByNombre($nombre) {
        //Compruebo que la imagen existe
        $isset = \Storage::disk('usuarios')->exists($nombre);
        if ($isset) {
            //Recupero y devuelvo la imagen
            $imagen = \Storage::disk('usuarios')->get($nombre);
            return new Response($imagen, 200);
        } else { //Si no existe devuelvo un error
            $respuesta = array(
                'codigo' => 400,
                'estado' => 'error',
                'mensaje' => 'La imagen no existe.'
            );
        }
        return response()->json($respuesta, $respuesta['codigo']);
    } 

    /**
     * Método que elimina la imagen del usuario
     */
    public function borrarImagen(Request $request) {

        //Cargo el token del usuario autenticado
        $token = $request->header('Authorization');
        //Recupero la ID del usuario autenticado
        $usuario = $this->getUsuarioByToken($token);

        //Compruebo que el archivo existe
        $isset = \Storage::disk('usuarios')->exists($usuario->imagen);

        //Si existe
        if ($isset) {
            //Borro la imagen
            $file = \Storage::disk('usuarios')->delete($usuario->imagen);
            //Elimino la referencia a la imagen en el modelos
             Usuario::where('id', $usuario->id)->update(['imagen' => null]);

            //Devuelvo un mensaje de éxito
            $respuesta = array(
                'codigo' => 200,
                'estado' => 'éxito',
                'mensaje' => 'La imagen se ha borrado correctamente.'
            );
        } else { //Si no existe devuelvo un error
            $respuesta = array(
                'codigo' => 400,
                'status' => 'error',
                'message' => 'La imagen no existe.'
            );
        }

        //Devuelvo la respuesta si ha habido error
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que devuelve la ID del usuario actualmente autenticado
     */
    private function getUsuarioByToken($token){

              //Creo un nuevo objeto de la clase JwtAuth
              $jwtAuth = new \JwtAuth();

              //Recupero el usuario del token recibido
              $usuario = $jwtAuth->checkToken($token, true);

              //Devuelvo el usuario
              return $usuario;
    }
}
