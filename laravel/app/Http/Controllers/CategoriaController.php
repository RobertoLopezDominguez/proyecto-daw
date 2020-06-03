<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Categoria;

class CategoriaController extends Controller
{

    public function __construct() {

        //Añado el middleware de autenticación a todos los métodos salvo las excepciones
        $this->middleware('api.auth', [
            'except' => ['mostrar', 'listarTodas']
        ]);
    } 

    /**
     * Función que crea una categoría nueva
     *
     * Método HTTP: POST
     * Ruta: /api/categoria
     */
    public function crear(Request $request){

        //Recoger los datos en un JSON
        $json = $request->input('json', null); //En caso de no llegar el valor sería nulo

        //Decodificar el JSON para convertirlo en un objeto
        $parametros_array = json_decode($json, true);

        //Validar los datos que recibimos
        $validar = \Validator::make($parametros_array, [
            'nombre'        => 'required|alpha_dash|max:50|unique:categorias'
        ]); 

        //Compruebo si la validación ha fallado
        if($validar->fails()){

            //En caso de fallo devuelvo una respuesta con el error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 400,
                'mensaje' => 'La categoría no se ha podido crear.',
                'errores' => $validar->errors()
            );

        }else{ //Si a validación es correcta procedo a dar de alta al usuario

            //Creamos una nueva categoría
            $categoria = new Categoria();

            //Asignamos a la categoria los valores requeridos que han llegado
            $categoria->nombre = $parametros_array['nombre'];

            //Guardamos la categoria en la base de datos
            $guardar_categoria = $categoria->save();

            //Si se ha guardado correctamente envío una respuesta de éxito
            if($guardar_categoria){
                $respuesta = array(
                    'estado' => 'éxito',
                    'codigo' => 200,
                    'mensaje' => 'La categoría se ha creado correctamente.',
                    'categoria' => $categoria,
                    'resultado' => $guardar_categoria
                );
            }else{ //Si no envío un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 500,
                    'mensaje' => 'Error al escribir en la base de datos.',
                    'resultado' => $guardar_categoria
                );
            }
            
        } 

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

     /**
     * Función que muestra una categoría buscando por un registro único
     * 
     * Recibe un ID
     * 
     * Método HTTP: GET
     * Ruta: /api/categoria/{id}
     */
    public function mostrar($id){

        //Recuperamos la categoría bucado por ID
        $categoria = Categoria::find($id);  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($categoria)){

            //Devuelvo un códido de éxito y la categoría
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Categoría encontrada.',
                'categoria' => $categoria
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'La categoría no se ha encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);

    }

    /**
     * Función que lista todas las categorías
     * 
     * No recibe ningún parámetro
     * 
     * Método HTTP: GET
     * Ruta: /api/categorias
     */
    public function listarTodas(){

        //Recuperamos todas las categorías
        $categoria = Categoria::all();  

        //Si la respuesta es un objeto es que se ha encontrado
        if(is_object($categoria)){

            //Devuelvo un códido de éxito y las categorias
            $respuesta = array(
                'estado' => 'éxito',
                'codigo' => 200,
                'mensaje' => 'Categorías encontradas.',
                'categorias' => $categoria
            );
        }else{  //Si no se ha encontrado devuelvo una respuesta de error
            $respuesta = array(
                'estado' => 'error',
                'codigo' => 404,
                'mensaje' => 'Las categorías no se han encontrado.'
            );
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }

    /**
     * Función que actualiza una categoría ya existente
     * 
     * Se debe enviar un JSON con la ID y los datos a actualizar
     * 
     * Método HTTP: PUT
     * Ruta: /api/categoria
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
                'nombre'        => 'required|alpha_dash|max:50|unique:categorias'
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

            }else{ //Si a validación es correcta procedo a actualizar la categoría

                //Quito los parámetros que no quiero actualizar por seguridad
                unset($parametros_array['created_at']);
                unset($parametros_array['updated_at']);

                //Actualizo el perfil en la base de datos
                $actualizar_categoria = Categoria::where('id', $parametros_array['id'])->update($parametros_array);

                //Si la actualización se ha realizado correctamente envío un mensaje de éxito
                if($actualizar_categoria){

                    $respuesta = array(
                        'estado' => 'éxito',
                        'codigo' => 200,
                        'mensaje' => 'Categoría actualizada correctamente.',
                        'resultado' => $actualizar_categoria
                    );
                }else{ //Si no muestro un mensaje de error

                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'Error al escribir en la base de datos.',
                        'resultado' => $actualizar_categoria
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
     * Función que elimina una categoria
     * 
     * Recibe el ID como parámetro
     * 
     * Método HTTP: DELETE
     * Ruta: /api/categoria/{id}
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
        
            //Compruebo si hay entradas que usan la categoría
            //Recupero la categoría
            $categoria = Categoria::find($id);

            //Compruebo si existe
            if(!is_object($categoria)){
                //Si no existe muestro un error
                $respuesta = array(
                    'estado' => 'error',
                    'codigo' => 404,
                    'mensaje' => 'La categoría no existe.'
                );
            } else { //Si existe
                //Compruebo si hay entradas asociadas a la categoría
                $entradas = $categoria->entradas()->count();

                //Si hay entradas asociadas a la categoría enviamos un error
                if($entradas){
                    $respuesta = array(
                        'estado' => 'error',
                        'codigo' => 500,
                        'mensaje' => 'No se puede borar una categoría asignada a una entrada.'
                    );
                } else { //Si no hay entradas asociados borramos la categoría

                    try{
                        $borrar_categoria = Categoria::destroy($id);
                    } catch (\Illuminate\Database\QueryException $e){
                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar la categoría',
                            'error' => $e
                        );
                    }

                    //Si la operación se ha realizado envío una respuesta de éxito
                    if($borrar_categoria){

                        $respuesta = array(
                            'estado' => 'éxito',
                            'codigo' => 200,
                            'mensaje' => 'Categoría borrada correctamente.',
                            'resultado' => $borrar_categoria
                        );
                    }else{ //Si no muestro un mensaje de error

                        $respuesta = array(
                            'estado' => 'error',
                            'codigo' => 500,
                            'mensaje' => 'Error al borrar la categoría.',
                            'resultado' => $borrar_categoria
                        );
                    }
                }
            }
        }

        //Devuelvo la respuesta con el código de la misma
        return response()->json($respuesta, $respuesta['codigo']);
    }
}
