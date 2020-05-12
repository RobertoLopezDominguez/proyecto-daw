<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Perfil;

class PerfilController extends Controller
{
    
    public function __construct() {

        //Añado el middleware de autenticación a todos los métodos salvo las excepciones
        $this->middleware('api.auth', [
            'except' => ['mostrar', 'listarTodos']
        ]);
    } 

    /**
     * Función que crea un perfil nuevo
     *
     * Método HTTP: POST
     * Ruta: /api/perfil
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un objeto
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'nombre'        => 'required|alpha_dash|max:50|unique:perfiles',
            'nivel_acceso'  => 'numeric'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'El perfil no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta al usuario

            //Creamos un nuevo perfil
            $perfil = new Perfil();

            //Asignamos al perfil los valores requeridos que han llegado
            $perfil->nombre = $parametros_array['nombre'];

            //Asignamos el resto de valores según hayan llegado o no
            if(isset($parametros_array['nivel_acceso'])) $perfil->nivel_acceso = $parametros_array['nivel_acceso'];

            //Guardamos el perfil en la base de datos
            $guardar_perfil = $perfil->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_perfil){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'El perfil se ha creado correctamente.',
                    'resultado' => $guardar_perfil
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_perfil
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra un perfil buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/perfil/{id}
     */
    public function mostrar($id){

        //Recuperamos el perfil bucado por ID
        $perfil = Perfil::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($perfil)){

            //Devuelvo un códido de éxito y el perfil
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Perfil encontrado.',
                'perfil' => $perfil
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'El perfil no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todos los perfiles
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/perfil
     */
    public function listarTodos(){

        //Recuperamos todos los perfiles
        $perfiles = Perfil::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($perfiles)){

            //Devuelvo un códido de éxito y los perfiles
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Perfiles encontrados.',
                'perfiles' => $perfiles
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Los perfiles no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza un perfil ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * No se pueden enviar 'nombre' si no se van a modificar
     * 
     * Método HTTP: PUT
     * Ruta: /api/perfil
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
                'nombre'        => 'alpha_dash|max:50|unique:perfiles',
                'nivel_acceso'  => 'numeric'
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

            }else{ //Si a validación es correcta procedo a actualizar el perfil

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);

                //Actualizo el perfil en la base de datos
                $actualizar_perfil = Perfil::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_perfil){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Perfil actualizado correctamente.',
                        'resultado' => $actualizar_perfil
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_perfil
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
     * Función que elimina un perfil
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/perfil/{id}
     */
    public function borrar($id){

        //Compruebo si ha llegado el ID
        if(!isset($id)){
            //Si no se ha recibido el ID
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'No se ha recibido el ID.'
            );
        } else { //Si llega el ID
        
            //Compruebo si hay usuarios que usan el perfil
            //Recupero el perfil
            $perfil = Perfil::find($id);

            //Compruebo si existe
            if(!is_object($perfil)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'El perfil no existe.'
                );
            } else { //Si existe
                //Compruebo si hay usuarios asociados al perfil
                $usuarios = $perfil->usuarios()->count();

                //Si hay usuarios asociados al perfil enviamos un error
                if($usuarios){
                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'No se puede borar un perfil asignado a un usuario.'
                    );
                } else { //Si no hay usuarios asociados borramos el perfil

                    try{
                        $borrar_perfil = Perfil::destroy($id);
                    } catch (\Illuminate\Database\QueryException $e){
                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar el perfil.',
                            'error' => $e
                        );
                    }

                    //Si la operación se ha realizado envío una respuesta de éxito
                    if($borrar_perfil){

                        $respuesta = array(
                            'estado' => 'éxito',
                            'codigo' => 200,
                            'mensaje' => 'Perfil borrado correctamente.',
                            'resultado' => $borrar_perfil
                        );
                    }else{ //Si no muestro un mensaje de error

                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar el perfil.',
                            'resultado' => $borrar_perfil
                        );
                    }
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }
}
