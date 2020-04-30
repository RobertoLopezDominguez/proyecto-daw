<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Entrada extends Model
{
    /**
     * Tabla asociada con el modelo
     */
    protected $table = 'entradas';

    /**
     * 
     * Relación de muchos a uno
     * 
     * La función devuelve el usuario asociado a la entrada
     * 
     */
    public function usuario(){
        return $this->belongsTo('App\Usuario', 'usuario_id');
    }

    /**
     * 
     * Relación de muchos a uno
     * 
     * La función devuelve la categoría asociada a la entrada
     * 
     */
    public function categoria(){
        return $this->belongsTo('App\Categoria', 'categoria_id');
    }

    /**
     * 
     * Relación de muchos a uno
     * 
     * La función devuelve la imagen asociada a la entrada
     * 
     */
    public function imagen(){
        return $this->belongsTo('App\Medio', 'imagen_id');
    }

    /**
     * 
     * Relación de muchos a muchos
     * 
     * La función devuelve las etiquetas asociadas a la entrada
     * 
     */
    public function etiquetas()
    {
        //return $this->belongsToMany('App\Etiqueta'); <-- esto valdría igual siguiendo los entándares de Laravel
        //Se pueden especificar (modelo, tabla pivote, id modelo actual, id del otro modelo)
        return $this->belongsToMany('App\Etiqueta', 'entradas_etiquetas', 'entrada_id', 'etiqueta_id');
    }

}
