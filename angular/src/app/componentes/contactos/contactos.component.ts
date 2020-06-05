import { Component, OnInit } from '@angular/core';
import { ContactoService } from '../../servicios/contacto.service';
import { UsuarioService } from '../../servicios/usuario.service';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Contacto } from '../../modelos/contacto';

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
    this.getContactos();
  }

  getContactos(){
    this._contactoService.getContactos(this.token).subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.contactos = response.contactos;
          console.log(this.contactos);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminar(id){
    this._contactoService.eliminar(this.token,id).subscribe(
      response => {
        if(response.estado == 'éxito'){
          this.getContactos();
        }
      },
      error => {
        console.log(error);
      }
    )
  }
}
