import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UsuarioService } from '../../servicios/usuario.service';
import { EntradaService } from '../../servicios/entrada.service';
import { Entrada } from '../../modelos/entrada';
import { global } from '../../servicios/global';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.css'],
  providers: [UsuarioService, EntradaService]
})
export class EntradasComponent implements OnInit {

  public page_title: string;
  public identidad;
  public token;
  public estado;
  public entradas;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _usuarioService: UsuarioService,
    private _entradaService: EntradaService
  ) { }

  ngOnInit(): void {

    this.page_title = 'Entradas';
    this.identidad = this._usuarioService.getIdentidad();
    this.token = this._usuarioService.getToken();

    //Cargo todas las entradas
    this.getEntradas();
  }

  getEntradas(){
    this._entradaService.getEntradas().subscribe(
      response => {
        
        if(response.estado == 'éxito'){
          this.entradas = response.entradas;
          console.log(this.entradas);

        }
      },
      error => {
        console.log(error);
      }
    );
  }

}
