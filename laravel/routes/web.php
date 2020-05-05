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
Route::resource('/api/categoria', 'CategoriaController');

//Rutas Usuarios
Route::get('/api/usuario', 'UsuarioController@mostrar')->name('usuario.mostrar'); //Devolver un usuario por id, usuario o email
Route::post('/api/usuario', 'UsuarioController@crear')->name('usuario.crear'); //Crea un usuario nuevo
Route::put('/api/usuario', 'UsuarioController@actualizar')->name('usuario.actualizar'); //Actualiza un usuario 
Route::delete('/api/usuario/{id}', 'UsuarioController@borrar')->name('usuario.borrar'); //Borra un usuario
