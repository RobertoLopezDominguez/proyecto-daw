/**
 * Componente para la gestión de los formularios de contacto en el back-end
 */
import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../servicios/contacto.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css'],
  providers: [ ContactoService, UsuarioService]
})
export class ContactosComponent implements OnInit {

  public page_title: string;
  public contactos;
  public identidad;
  public token;
  public faTrashAlt = faTrashAlt;

  constructor(
    private _contactoService: ContactoService,
    private _usuarioService: UsuarioService
  ) {
    this.page_title = 'Contactos';

    //Recupero la identidad del usuario logueado
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();
   }

  ngOnInit(): void {
    //Recupero todos los contactos al iniciar el componente
    this.getContactos();
  }

  /**
   * Método que recupera los contactos
   */
  getContactos(){
    //Utilizo el servicios para recuperar los contactos
    this._contactoService.getContactos(this.token).subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.contactos = response.contactos;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  /**
   * Método que elimina un formulario de contacto por ID
   */
  eliminar(id){
    //Paso el id al método correspondiente del servicio para que lo elimine
    this._contactoService.eliminar(this.token,id).subscribe(
      response => {
        if(response.estado == 'éxito'){
          //Actualizo la lista de contactos
          this.getContactos();
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
