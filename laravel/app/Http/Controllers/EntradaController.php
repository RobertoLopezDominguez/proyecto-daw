<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Entrada;
use App\Etiqueta;

class EntradaController extends Controller
{
    /**
     * Función que crea una entrada nueva
     *
     * Método HTTP: POST
     * Ruta: /api/entrada
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un array
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'usuario_id'        => 'required|numeric',
            'categoria_id'      => 'required|numeric',
            'estado'            => 'required|alpha|max:50',
            'titulo'            => 'max:50',
            'imagen_id'         => 'max:255'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'La entrada no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta la entrada

            //Creamos una nueva entrada
            $entrada = new Entrada();

            //Asignamos a la entrada los valores requeridos que han llegado
            $entrada->usuario_id = $parametros_array['usuario_id'];
            $entrada->categoria_id = $parametros_array['categoria_id'];
            $entrada->estado = $parametros_array['estado'];

            //Asignamos el resto de valores según hayan llegado o no
            if(isset($parametros_array['titulo'])) $entrada->titulo = $parametros_array['titulo'];
            if(isset($parametros_array['contenido'])) $entrada->contenido = $parametros_array['contenido'];
            if(isset($parametros_array['imagen_id'])) $entrada->imagen_id = $parametros_array['imagen_id'];

            //Guardamos la entrada en la base de datos
            $guardar_entrada = $entrada->save();

            //Copruebo si se han enviado etiquetas
            if(isset($parametros_array['etiquetas'])){

                //Recorro todas las etiquetas
                foreach($parametros_array['etiquetas'] as $etiqueta){

                    //Compruebo si la etiqueta ya existe
                    $e = Etiqueta::where('nombre', $etiqueta)->first();

                    //Si no existe la creo
                    if(!$e){

                        $nueva_etiqueta = new Etiqueta();
                        $nueva_etiqueta->nombre = $etiqueta;
                        $nueva_etiqueta->save();

                        //Asigno el ID de la nueva etiqueta
                        $etiqueta_id = $nueva_etiqueta->id;
                    }else{ 
                        //Si existe recupero la ID
                        $etiqueta_id = $e->id;
                    }

                    //Relaciono la etiqueda con la entrada en la tabla pivote
                    $entrada->etiquetas()->attach($etiqueta_id);

                }
            }

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_entrada){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'La entrada se ha creado correctamente.',
                    'resultado' => $guardar_entrada
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_entrada
                );
            }
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra una entrada buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/entrada/{id}
     */
    public function mostrar($id){

        //Recuperamos la entrada bucado por ID
        $entrada = Entrada::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($entrada)){

            //Creo sendos arrays para la entrada y las etiquetas
            $entrada_array = json_decode($entrada,true);
            $etiquetas_array = array('etiquetas' => $entrada->etiquetas()->pluck('nombre'));

            //Los uno para dar un único resultado con las etiquetas incluidas 
            $entrada = array_merge($entrada_array, $etiquetas_array);

            //Devuelvo un códido de éxito y la entrada y sus etiquetas
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Etiqueta encontrada.',
                'entrada' => $entrada
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'La entrada no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todas las entradas
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/entradas
     */
    public function listarTodas(){

        //Recuperamos todas las etiqueta
        $entradas = Entrada::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($entradas)){

            //recorro todas las entradas para añadirle las etiquetas
            for($i=0; $i < sizeof($entradas); $i++){
                //Creo sendos arrays para la entrada y las etiquetas
                $entrada_array = json_decode($entradas[$i],true);
                $etiquetas_array = array('etiquetas' => $entradas[$i]->etiquetas()->pluck('nombre'));

                //Los uno para dar un único resultado con las etiquetas incluidas 
                $entradas[$i] = array_merge($entrada_array, $etiquetas_array);
            }

            //Devuelvo un códido de éxito y las etiqueta
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Entradas encontradas.',
                'etiqueta' => $entradas
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Las entradas no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza una entrada ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * 
     * Método HTTP: PUT
     * Ruta: /api/entrada
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
                'id'                => 'required|numeric',
                'usuario_id'        => 'numeric',
                'categoria_id'      => 'numeric',
                'estado'            => 'alpha|max:50',
                'titulo'            => 'max:50',
                'imagen_id'         => 'max:255'
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

            }else{ //Si a validación es correcta procedo a actualizar la entrada

                //Creo una variable para almacenar los mensajes de actualización de las etiquetas
                $msg_etiquetas = "";

                //Recupero la entrada a actualiar
                $entrada = Entrada::find($parametros_array['id']); 

                //Estraigo las etiquetas si se han enviado
                if(isset($parametros_array['etiquetas'])){

                    $etiquetas = $parametros_array['etiquetas'];

                    //Las elimino de los parámetros de la entrada
                    unset($parametros_array['etiquetas']);

                    //Recorro todas las etiquetas
                    foreach($etiquetas as $etiqueta){

                        //Compruebo si la etiqueta ya existe
                        $e = Etiqueta::where('nombre', $etiqueta)->first();

                        //Si no existe la creo
                        if(!$e){

                            $e = new Etiqueta();
                            $e->nombre = $etiqueta;
                            $e->save();

                            //Asigno el ID de la nueva etiqueta
                            $etiqueta_id = $e->id;
                        }else{ 
                            //Si existe recupero la ID
                            $etiqueta_id = $e->id;
                        }

                        //Relaciono la etiqueda con la entrada en la tabla pivote
                        try{
                            $entrada->etiquetas()->attach($etiqueta_id); 
                        }catch(\Illuminate\Database\QueryException $e){
                            //Si se produce un error al insertar es porque la etiqueta ya
                            //está relacionada con la entrada.
                            //Añadimos la información al mensaje
                            $msg_etiquetas = $msg_etiquetas."La etiqueta '".$etiqueta."' ya está asociada a esta entrada. ";
                        }
 
                    } 
                }

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);

                //Actualizo la entrada en la base de datos
                $actualizar_entrada= Entrada::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_entrada){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Entrada actualizada correctamente.',
                        'resultado' => $actualizar_entrada,
                        'etiquetas' => $msg_etiquetas
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_entrada
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

}
