import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../modelos/Usuario'; //Importo mi modelo de usuario para el registro
import { UsuarioService } from '../../servicios/usuario.service'; //Importo el servicio para Usuario

@Component({
  selector: 'registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  providers: [UsuarioService]
})
export class RegistroComponent implements OnInit {

  //Propiedadess
  public page_title: string;
  public usuario: Usuario; //Donde almacenar el usuario para el registro
  public estado: string; //Estado del registro del usuario

  constructor( 
    private _usuarioService: UsuarioService
   ) { 
    this.page_title = "Registro";

    /**
     * Creo un objeto para el usuario vacío
     * 
     * Por defecto el perfilId es 5 (Invitado)
     * y el estado 'Activo'
     */
    this.usuario = new Usuario(
      1, '', '', '5', '', 'Activo', '', '', ''
    );
  }

  ngOnInit(): void {
  }

  /**
   * Método al que se llama al enviar el formulario
   * 
   * Recibe como parámetro el formulario enviado
   */
  onSubmit(form){
    //Llamo al método de registro enviando el usuario
    //El Observable devuelve una respuesta o un error
    this._usuarioService.registro(this.usuario).subscribe(
      response => {
        //Compruebo que la respuesta desde el API haya tenido éxito
        if(response.estado == "éxito"){
          //Si ha tenid éxito asigno la respuesta al estado
          this.estado = response.estado;

          //Vacio el formulario después del submit
          form.reset();
        }else{ //Si no marco cmo error
          this.estado = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this.estado = 'error';
      }
    );


  }

}
