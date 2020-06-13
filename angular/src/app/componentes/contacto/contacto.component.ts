/**
 * Componente para el formulario público de contacto
 */
import { Component, OnInit } from '@angular/core';
import { Contacto } from 'src/app/modelos/contacto';
import { ContactoService } from '../../servicios/contacto.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
  providers: [ContactoService]
})
export class ContactoComponent implements OnInit {

  public page_title: string;
  public contacto;
  public estado;

  constructor(
    private _contactoService: ContactoService,
    private _http: HttpClient
  ) { 
    this.page_title = "Contacto";

    //Creo un nuevo objeto de contacto vacío
    this.contacto = new Contacto(1, '','','','','','','');
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    //Recupero la IP de cliente usando un servicio externo
    this._http.get("http://api.ipify.org/?format=json").subscribe(
      (response:any) => {
        //Asigno la IP al objeto del contacto
        this.contacto.ip = response.ip;

        //Envío la petición para registrar el contacto nuevo
        this._contactoService.nuevo(this.contacto).subscribe(
          response => {
            if(response['estado'] == 'éxito'){
              this.estado = 'éxito';
            }
            //Limpio el formulario
            form.reset();
          },
          error => {
            this.estado = 'error';
          }
        )

    });
  }

}
