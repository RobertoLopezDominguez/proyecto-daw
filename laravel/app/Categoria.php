<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    //El modelo utiliza la tabla 'categorias'
    protected $table = 'categorias';

    /**
     * Relación de uno a muchos con la tabla Entradas
     * 
     * La función devuelve todas las entradas de la categoría
     * 
     */
    public function entradas(){
        return $this->hasMany('App\Entrada');
    }
}
