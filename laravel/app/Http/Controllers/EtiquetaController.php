<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Etiqueta;

class EtiquetaController extends Controller
{
    
    public function __construct() {

        //Añado el middleware de autenticación a todos los métodos salvo las excepciones
        $this->middleware('api.auth', [
            'except' => ['getEntradas', 'mostrar', 'listarTodas']
        ]);
    } 

    /**
     * Función que crea una etiqueta nueva
     *
     * Método HTTP: POST
     * Ruta: /api/etiqueta
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un objeto
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'nombre'        => 'required|max:50|unique:etiquetas'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'La etiqueta no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta la etiqueta

            //Creamos una nueva etiqueta
            $etiqueta = new Etiqueta();

            //Asignamos a la etiqueta los valores requeridos que han llegado
            $etiqueta->nombre = $parametros_array['nombre'];

            //Guardamos la categoria en la base de datos
            $guardar_etiqueta = $etiqueta->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_etiqueta){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'La etiqueta se ha creado correctamente.',
                    'resultado' => $guardar_etiqueta
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_etiqueta
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra una etiqueta buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/etiqueta/{id}
     */
    public function mostrar($id){

        //Recuperamos la etiqueta bucado por ID
        $etiqueta = Etiqueta::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($etiqueta)){

            //Devuelvo un códido de éxito y la etiqueta
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Etiqueta encontrada.',
                'etiqueta' => $etiqueta
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'La etiqueta no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todas las etiqueta
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/etiqueta
     */
    public function listarTodas(){

        //Recuperamos todas las etiqueta
        $etiqueta = Etiqueta::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($etiqueta)){

            //Devuelvo un códido de éxito y las etiqueta
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Etiqueta encontradas.',
                'etiqueta' => $etiqueta
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Las etiqueta no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza una etiqueta ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * 
     * Método HTTP: PUT
     * Ruta: /api/etiqueta
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
                'nombre'        => 'required|max:50|unique:etiquetas'
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

            }else{ //Si a validación es correcta procedo a actualizar la etiqueta

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);

                //Actualizo el perfil en la base de datos
                $actualizar_etiqueta= Etiqueta::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_etiqueta){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Etiqueta actualizada correctamente.',
                        'resultado' => $actualizar_etiqueta
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_etiqueta
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
     * Función que elimina una etiqueta
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/etiqueta/{id}
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
        
            //Compruebo si hay entradas que usan la etiqueta
            //Recupero la etiqueta
            $etiqueta = Etiqueta::find($id);

            //Compruebo si existe
            if(!is_object($etiqueta)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'La etiqueta no existe.'
                );
            } else { //Si existe
                //Compruebo si hay entradas asociadas a la etiqueta
                $entradas = $etiqueta->entradas()->count();

                //Si hay entradas asociadas a la categoría enviamos un error
                if($entradas){
                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'No se puede borar una etiqueta asignada a una entrada.'
                    );
                } else { //Si no hay entradas asociados borramos la etiqueta

                    try{
                        $borrar_etiqueta = Etiqueta::destroy($id);
                    } catch (\Illuminate\Database\QueryException $e){
                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar la etiqueta',
                            'error' => $e
                        );
                    }

                    //Si la operación se ha realizado envío una respuesta de éxito
                    if($borrar_etiqueta){

                        $respuesta = array(
                            'estado' => 'éxito',
                            'codigo' => 200,
                            'mensaje' => 'Etiqueta borrada correctamente.',
                            'resultado' => $borrar_etiqueta
                        );
                    }else{ //Si no muestro un mensaje de error

                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar la etiqueta.',
                            'resultado' => $borrar_etiqueta
                        );
                    }
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que devuelve todas las entradas de una etiqueta
     * 
     * Recibe un JSON con el nombre
     * 
     * Método HTTP: GET
     * Ruta: /api/etiqueta/entradas
     */
    public function getEntradas(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un array
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'nombre'        => 'required'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'No se ha encontrado el nombre de la etiqueta.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta 

            //Recupero la etiqueta
            $etiqueta = Etiqueta::where('nombre', $parametros_array['nombre'])->first();

            //Compruebo si existe
            if(!is_object($etiqueta)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'La etiqueta no existe.'
                );
            } else { //Si existe

                //Recupero todas las entradas asociadas a la etiqueta
                $entradas = $etiqueta->entradas()->get();

                //Si la operación se ha realizado envío una respuesta de éxito
                if($entradas){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Entradas encontradas.',
                        'entradas' => $entradas
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'No se han encontrado entradas.'
                    );
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }
}
