<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Usuario extends Authenticatable
{
    use Notifiable;

    /**
     * Tabla asociada con el modelo
     */
    protected $table = 'usuarios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'usuario', 'email', 'perfil_id'. 'password', 'estado', 'nombre', 'apellidos', 'imagen',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * Relación de uno a muchos con la tabla Entradas
     * 
     * La función devuelve todas las entradas del Usuario
     * 
     */
    public function entradas(){
        return $this->hasMany('App\Entrada');
    }

    /**
     * 
     * Relación de muchos a uno
     * 
     * La función devuelve el perfil asociado al usuario
     * 
     */
    public function perfil(){
        return $this->belongsTo('App\Perfil', 'perfil_id');
    }

}
