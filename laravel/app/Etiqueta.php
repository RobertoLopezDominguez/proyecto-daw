<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Etiqueta extends Model
{
    /**
     * Tabla asociada con el modelo
     */
    protected $table = 'etiquetas';

    /**
     * 
     * Relación de muchos a muchos
     * 
     * La función devuelve las entradas asociadas a una etiqueta
     * 
     */
    public function entradas()
    {
        //return $this->belongsToMany('App\Entrada'); <-- esto valdría igual siguiendo los entándares de Laravel
        //Se pueden especificar (modelo, tabla pivote, id modelo actual, id del otro modelo)
        return $this->belongsToMany('App\Entrada', 'entradas_etiquetas', 'etiqueta_id', 'entrada_id')->withTimestamps();
    }
}
