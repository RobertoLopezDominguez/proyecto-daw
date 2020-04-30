<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Perfil extends Model
{
    /**
     * Tabla asociada con el modelo
     */
    protected $table = 'perfiles';

    /**
     * Relación de uno a muchos con la tabla Usuarios
     * 
     * La función devuelve todos los usuarios del perfil
     * 
     */
    public function usuarios(){
        return $this->hasMany('App\Usuario');
    }
}
