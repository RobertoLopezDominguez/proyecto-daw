<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

/**
 * Rutas a los distintos controladores de cada modelo
 * 
 * La opción 'resource' crea las rutas para todos los metodos CRUD
 * 
 * Se pueden consultar en la consola con el comando: 'php artisan route:list'
 */
//Route::resource('/api/categoria', 'CategoriaController');

//Rutas Usuarios
Route::get('/api/usuario', 'UsuarioController@mostrar')->name('usuario.mostrar'); //Devolver un usuario por id, usuario o email
Route::get('/api/usuarios', 'UsuarioController@getUsuarios')->name('usuario.getUsuarios'); //Devolver todos los usuarios
Route::get('/api/usuario/{id}', 'UsuarioController@getUsuarioById')->name('usuario.usuarioById'); //Devolver un usuario por id
Route::post('/api/registro', 'UsuarioController@registro')->name('usuario.registro'); //Registra un usuario nuevo
Route::put('/api/usuario', 'UsuarioController@actualizar')->name('usuario.actualizar'); //Actualiza un usuario 
Route::delete('/api/usuario/imagen', 'UsuarioController@borrarImagen')->name('usuario.borrarImagen'); //Borra una imagen de usuario
Route::delete('/api/usuario/{id}', 'UsuarioController@borrar')->name('usuario.borrar'); //Borra un usuario
Route::post('/api/login', 'UsuarioController@login')->name('usuario.login'); //Loguea a un usuario
Route::post('/api/usuario/imagen', 'UsuarioController@cargarImagen')->name('usuario.cargarImagen'); //Carga una imagen de usuario

Route::get('/api/usuario/imagen', 'UsuarioController@getImagen')->name('usuario.getImagen'); //Devuelve la imagen de usuario
Route::get('/api/usuario/imagen/{imagen}', 'UsuarioController@getImagenByNombre')->name('usuario.getImagenByNombre'); //Devuelve la imagen

//Rutas Perfiles
Route::get('/api/perfil/{id}', 'PerfilController@mostrar')->name('perfil.mostrar'); //Devolver un perfil por id
Route::get('/api/perfiles', 'PerfilController@listarTodos')->name('perfil.listarTodos'); //Devolver todos los perfiles
Route::post('/api/perfil', 'PerfilController@crear')->name('perfil.crear'); //Crea un perfil nuevo
Route::put('/api/perfil', 'PerfilController@actualizar')->name('perfil.actualizar'); //Actualiza un perfil 
Route::delete('/api/perfil/{id}', 'PerfilController@borrar')->name('perfil.borrar'); //Borra un perfil

//Rutas Categorías
Route::get('/api/categoria/{id}', 'CategoriaController@mostrar')->name('categoria.mostrar'); //Devolver una categoria por id
Route::get('/api/categorias', 'CategoriaController@listarTodas')->name('categoria.listarTodas'); //Devolver todas las categorias
Route::get('/api/categoriasnovacias', 'CategoriaController@listarTodasNoVacias')->name('categoria.listarTodasNoVacias'); //Devolver todas las categorias no vacías
Route::post('/api/categoria', 'CategoriaController@crear')->name('categoria.crear'); //Crea una categoria nueva
Route::put('/api/categoria', 'CategoriaController@actualizar')->name('categoria.actualizar'); //Actualiza una categoria
Route::delete('/api/categoria/{id}', 'CategoriaController@borrar')->name('categoria.borrar'); //Borra una categoria

//Rutas Medios
Route::get('/api/medio/{nombre}', 'MedioController@getMedio')->name('medio.getMedio'); //Devolver un medio por nombre
Route::get('/api/medio/id/{id}', 'MedioController@mostrar')->name('medio.mostrar'); //Devolver un medio por id
Route::get('/api/medios', 'MedioController@listarTodos')->name('medio.listarTodos'); //Devolver todos los medios
Route::post('/api/medio', 'MedioController@crear')->name('medio.crear'); //Crea un medio nuevo
Route::put('/api/medio', 'MedioController@actualizar')->name('medio.actualizar'); //Actualiza un medio
Route::delete('/api/medio/{id}', 'MedioController@borrar')->name('medio.borrar'); //Borra un medio

//Rutas Contactos
Route::get('/api/contacto/{id}', 'ContactoController@mostrar')->name('contacto.mostrar'); //Devolver un contacto por id
Route::get('/api/contactos', 'ContactoController@listarTodos')->name('contacto.listarTodos'); //Devolver todos los contactos
Route::post('/api/contacto', 'ContactoController@crear')->name('contacto.crear'); //Crea un contacto nuevo
Route::put('/api/contacto', 'ContactoController@actualizar')->name('contacto.actualizar'); //Actualiza un contacto
Route::delete('/api/contacto/{id}', 'ContactoController@borrar')->name('contacto.borrar'); //Borra un contacto

//Rutas Etiquetas
Route::post('/api/etiqueta_entradas', 'EtiquetaController@getEntradas')->name('etiqueta.getEntradas'); //Devolver todas las entradas de una etiqueta
Route::get('/api/etiqueta/{id}', 'EtiquetaController@mostrar')->name('etiqueta.mostrar'); //Devolver una etiqueta por id
Route::get('/api/etiquetas', 'EtiquetaController@listarTodas')->name('etiqueta.listarTodos'); //Devolver todas las etiquetas
Route::post('/api/etiqueta', 'EtiquetaController@crear')->name('etiqueta.crear'); //Crea una etiqueta nueva
Route::put('/api/etiqueta', 'EtiquetaController@actualizar')->name('etiqueta.actualizar'); //Actualiza una etiqueta
Route::delete('/api/etiqueta/{id}', 'EtiquetaController@borrar')->name('etiqueta.borrar'); //Borra una etiqueta

//Rutas entradas
Route::get('/api/entrada/{id}', 'EntradaController@mostrar')->name('entrada.mostrar'); //Devolver una entrada por id
Route::get('/api/entradas', 'EntradaController@listarTodas')->name('entrada.mostrar'); //Devolver todas las entradas
Route::get('/api/entradaspublicadas', 'EntradaController@listarTodasPublicadas')->name('entrada.mostrarPublicadas'); //Devolver todas las entradas publicadas
Route::get('/api/entradaspublicadas/categoria/{id}', 'EntradaController@listarTodasPublicadasByCategoria')->name('entrada.mostrarPublicadasCategoria'); //Devolver todas las entradas publicadas por categoría
Route::post('/api/entrada', 'EntradaController@crear')->name('entrada.crear'); //Crea una entrada nuevo
Route::put('/api/entrada', 'EntradaController@actualizar')->name('entrada.actualizar'); //Actualiza una entrada 
Route::delete('/api/entrada/{id}', 'EntradaController@borrar')->name('entrada.borrar'); //Borra una entrada