import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Importo el módulo para los formularios
import { FormsModule } from '@angular/forms';
//Importo el módulo HTTP necesario para enviar datos
import { HttpClientModule } from '@angular/common/http';
//Importo las rutas
import { routing, appRoutingProviders } from './app.routing';
//Importo Angular-file-uploader para subir ficheros (módulo añadido a package.json)
import { AngularFileUploaderModule } from "angular-file-uploader";
//import { AngularFileUploaderModule } from "angular-file-uploader";

//Importo los componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ErrorComponent } from './componentes/error/error.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { CategoriaNuevaComponent } from './componentes/categoria-nueva/categoria-nueva.component';

//Declaro los módulos que voy a utilizar
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    ErrorComponent,
    AdminComponent,
    PerfilUsuarioComponent,
    CategoriaNuevaComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    AngularFileUploaderModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
