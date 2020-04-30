<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Medio extends Model
{
    /**
     * Tabla asociada con el modelo
     */
    protected $table = 'medios';

    /**
     * Relación de uno a muchos con la tabla Entradas
     * 
     * La función devuelve todas las entradas a las que está asociado un medio
     * 
     */
    public function entradas(){
        return $this->hasMany('App\Entrada', 'imagen_id');
    }
}
