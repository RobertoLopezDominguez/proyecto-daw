<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Contacto;

class ContactoController extends Controller
{
    /**
     * Función que crea un contacto nuevo
     *
     * Método HTTP: POST
     * Ruta: /api/contacto
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un objeto
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'ip'            => 'required|ip|max:50',
            'nombre'        => 'required|max:50',
            'direccion'     => 'max:255',
            'email'         => 'max:255',
            'telefono'      => 'max:50',
            'asunto'        => 'max:255'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'El contacto no se ha podido crear ',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta al contacto

            //Creamos un nuevo contacto
            $contacto = new Contacto();

            //Asignamos al contacto los valores requeridos que han llegado
            $contacto->nombre = $parametros_array['nombre'];
            $contacto->ip = $parametros_array['ip'];

            //Asignamos el resto de valores según hayan llegado o no
            if(isset($parametros_array['direcion'])) $contacto->direccion = $parametros_array['direccion'];
            if(isset($parametros_array['email'])) $contacto->email = $parametros_array['email'];
            if(isset($parametros_array['telefono'])) $contacto->telefono = $parametros_array['telefono'];
            if(isset($parametros_array['asunto'])) $contacto->asunto = $parametros_array['asunto'];
            if(isset($parametros_array['mensaje'])) $contacto->mensaje = $parametros_array['mensaje'];

            //Guardamos el contacto en la base de datos
            $guardar_contacto = $contacto->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_contacto){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'El contacto se ha creado correctamente.',
                    'resultado' => $guardar_contacto
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_contacto
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra un contacto buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/contato/{id}
     */
    public function mostrar($id){

        //Recuperamos el contacto bucado por ID
        $contacto = Contacto::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($contacto)){

            //Devuelvo un códido de éxito y el contacto
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Contacto encontrado.',
                'contacto' => $contacto
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'El contacto no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todos los contactos
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/contacto
     */
    public function listarTodos(){

        //Recuperamos todos los contacto
        $contactos = Contacto::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($contactos)){

            //Devuelvo un códido de éxito y el contacto
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Contactos encontrados.',
                'contactos' => $contactos
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Los contactos no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza un contacto ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * 
     * Método HTTP: PUT
     * Ruta: /api/contacto
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
                'ip'            => 'ip|max:50'
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

            }else{ //Si a validación es correcta procedo a actualizar el contacto

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);

                //Actualizo el contacto en la base de datos
                $actualizar_contacto = Contacto::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_contacto){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Contacto actualizado correctamente.',
                        'resultado' => $actualizar_contacto
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_contacto
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
     * Función que elimina un contacto
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/contacto/{id}
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
        
            //Compruebo si hay entradas que usan el contacto
            //Recupero el contacto
            $contacto = Contacto::find($id);

            //Compruebo si existe
            if(!is_object($contacto)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'El contacto no existe.'
                );
            } else { //Si existe lo elimino
                
                try{
                    $borrar_contacto = Contacto::destroy($id);
                } catch (\Illuminate\Database\QueryException $e){
                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al borrar el contacto',
                        'error' => $e
                    );
                }

                //Si la operación se ha realizado envío una respuesta de éxito
                if($borrar_contacto){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Contacto borrado correctamente.',
                        'resultado' => $borrar_contacto
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al borrar el contacto.',
                        'resultado' => $borrar_contacto
                    );
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }
}
