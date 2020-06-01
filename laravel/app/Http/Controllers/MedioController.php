<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Medio;

class MedioController extends Controller
{
    
    public function __construct() {

        //Añado el middleware de autenticación a todos los métodos salvo las excepciones
        $this->middleware('api.auth', [
            'except' => ['mostrar', 'listarTodos','getMedio']
        ]);
    } 

    /**
     * Función que crea un medio nuevo
     *
     * Método HTTP: POST
     * Ruta: /api/medio
     */
    public function crear(Request $request){

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
            \Storage::disk('medios')->put($nombre_imagen, \File::get($imagen));

            //Creo un nuevo medio
            $medio = new Medio();

            //Asigno los valores obligatorios al nuevo medio
            //Nombre
            $medio->nombre = $nombre_imagen;
            //ruta
            $medio->ruta = 'api/medio/'.$nombre_imagen;
            //tipo
            $cadena_nombre = explode('.', $nombre_imagen);
            $extension = end($cadena_nombre);
            $medio->tipo = $extension;
            //Estado (Al crear por defecto 'Publicado')
            $medio->estado = 'Publicado';

            //Guardamos el medio en la base de datos
            $guardar_medio = $medio->save();

            $respuesta = array(
                'codigo' => 200,
                'estado' => 'éxito',
                'mensaje' => 'El medio se ha creado correctamente.',
                'medio' => $medio,
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
     * Función que muestra un medio buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/medio/id/{id}
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

                //Quito los parámetros que no quiero actualizar
                unset($parametros_array['nombre']);
                unset($parametros_array['ruta']);
                unset($parametros_array['tipo']);
                unset($parametros_array['created_at']);
                unset($parametros_array['updated_at']);

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

    /**
     * Método para subir un medio
     * 
     * Recibe un archivo llamado 'file0'
     */
    public function cargarMedio(Request $request){

        //Recojo el medio de la petición
        $medio = $request->file('file0'); 

        //Compruebo que el medioha llegado
        if($medio){

            //Creo un nombre para el medio añadiendo la hora actual al nombre original
            $nombre_medio = time()."_".$medio->getClientOriginalName();

            \Storage::disk('medios')->put($nombre_medio, \File::get($medio));

            $respuesta = array(
                'codigo' => 200,
                'estado' => 'éxito',
                'imaegn' => $nombre_medio
            );
        }else{ //Si no llega devuelvo un error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'Error al subir el medio.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Método que devuelve un medio
     */
    public function getMedio($nombre_medio) {

        //Compruebo que el archivo existe
        $isset = \Storage::disk('medios')->exists($nombre_medio);

        //Si existe
        if ($isset) {
            //Recupero el medio
            $file = \Storage::disk('medios')->get($nombre_medio);

            //Devuelvo el medio
            return new Response($file, 200);
        } else { //Si no existe devuelvo un error
            $respuesta = array(
                'codigo' => 400,
                'estado' => 'error',
                'mensaje' => 'El medio no existe.'
            );
        }

        //Devuelvo la respuesta si ha habido error
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Método que elimina un medio
     * 
     * Protocolo HTTP: DELETE
     */
    public function borrarMedio($nombre_medio) {

        //Compruebo que el archivo existe
        $isset = \Storage::disk('medios')->exists($nombre_medios);

        //Si existe
        if ($isset) {
            //Borro el edio
            $file = \Storage::disk('medios')->delete($nombre_medios);

            //Devuelvo un mensaje de éxito
            $respuesta = array(
                'codigo' => 200,
                'estado' => 'éxito',
                'mensaje' => 'El mediose ha borrado correctamente.'
            );
        } else { //Si no existe devuelvo un error
            $respuesta = array(
                'codigo' => 400,
                'status' => 'error',
                'message' => 'El medio no existe.'
            );
        }

        //Devuelvo la respuesta si ha habido error
        return response()->json($respuesta, $respuesta['codigo']);
    }

}
