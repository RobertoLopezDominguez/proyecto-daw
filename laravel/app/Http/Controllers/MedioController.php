<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Medio;

class MedioController extends Controller
{
    /**
     * Función que crea un medio nuevo
     *
     * Método HTTP: POST
     * Ruta: /api/medio
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un objeto
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'nombre'        => 'required|max:255|unique:medios',
            'ruta'          => 'required|max:255|unique:medios',
            'tipo'          => 'required|alpha|max:50',
            'estado'        => 'required|alpha|max:50',
            'titulo'        => 'max:255',
            'texto_alt'     => 'max:255',
            'leyenda'       => 'max:255'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'El medio no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta al medio

            //Creamos un nuevo medio
            $medio = new Medio();

            //Asignamos al medio los valores requeridos que han llegado
            $medio->nombre = $parametros_array['nombre'];
            $medio->ruta = $parametros_array['ruta'];
            $medio->tipo = $parametros_array['tipo'];
            $medio->estado = $parametros_array['estado'];

            //Asignamos el resto de valores según hayan llegado o no
            if(isset($parametros_array['titulo'])) $medio->titulo = $parametros_array['titulo'];
            if(isset($parametros_array['texto_alt'])) $medio->texto_alt = $parametros_array['texto_alt'];
            if(isset($parametros_array['leyenda'])) $medio->leyenda = $parametros_array['leyenda'];
            if(isset($parametros_array['descripcion'])) $medio->descripcion = $parametros_array['descripcion'];

            //Guardamos el medio en la base de datos
            $guardar_medio = $medio->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_medio){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'El medio se ha creado correctamente.',
                    'resultado' => $guardar_medio
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_medio
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra un medio buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/medio/{id}
     */
    public function mostrar($id){

        //Recuperamos el medio bucado por ID
        $medio = Medio::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($medio)){

            //Devuelvo un códido de éxito y el medio
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Medio encontrado.',
                'medio' => $medio
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'El medio no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todos los medios
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/medio
     */
    public function listarTodos(){

        //Recuperamos todos los medios
        $medios = Medio::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($medios)){

            //Devuelvo un códido de éxito y los medios
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Medios encontrados.',
                'medios' => $medios
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Los medios no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza un medio ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * No se pueden enviar 'nombre', 'ruta' si no se van a modificar
     * 
     * Método HTTP: PUT
     * Ruta: /api/medio
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
                'nombre'        => 'max:255|unique:medios',
                'ruta'          => 'max:255|unique:medios',
                'tipo'          => 'alpha|max:50',
                'estado'        => 'alpha|max:50',
                'titulo'        => 'max:255',
                'texto_alt'     => 'max:255',
                'leyenda'       => 'max:255'
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

            }else{ //Si a validación es correcta procedo a actualizar el medio

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);

                //Actualizo el perfil en la base de datos
                $actualizar_medio = Medio::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_medio){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Medio actualizado correctamente.',
                        'resultado' => $actualizar_medio
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_medio
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
     * Función que elimina un medio
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/medio/{id}
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
        
            //Compruebo si hay entradas que usan el medio
            //Recupero el medio
            $medio = Medio::find($id);

            //Compruebo si existe
            if(!is_object($medio)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'El medio no existe.'
                );
            } else { //Si existe
                //Compruebo si hay entradas asociadas al medio
                $entradas = $medio->entradas()->count();

                //Si hay entradas asociadas a la categoría enviamos un error
                if($entradas){
                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'No se puede borar un medio asignado a una entrada.'
                    );
                } else { //Si no hay entradas asociados borramos el perfil

                    try{
                        $borrar_medio = Medio::destroy($id);
                    } catch (\Illuminate\Database\QueryException $e){
                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar el medio',
                            'error' => $e
                        );
                    }

                    //Si la operación se ha realizado envío una respuesta de éxito
                    if($borrar_medio){

                        $respuesta = array(
                            'estado' => 'éxito',
                            'codigo' => 200,
                            'mensaje' => 'Medio borrado correctamente.',
                            'resultado' => $borrar_medio
                        );
                    }else{ //Si no muestro un mensaje de error

                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar el medio.',
                            'resultado' => $borrar_medio
                        );
                    }
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }
}
