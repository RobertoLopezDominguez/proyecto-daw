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
//Editor de texto enriquecido
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

//Importo los componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ErrorComponent } from './componentes/error/error.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { NuevaEntradaComponent } from './componentes/nueva-entrada/nueva-entrada.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EntradasComponent } from './componentes/entradas/entradas.component';
import { EditarEntradaComponent } from './componentes/editar-entrada/editar-entrada.component';
import { MediosComponent } from './componentes/medios/medios.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NuevoMedioComponent } from './componentes/nuevo-medio/nuevo-medio.component';
import { BibliotecaMediosComponent } from './componentes/biblioteca-medios/biblioteca-medios.component';
import { EditarMedioComponent } from './componentes/editar-medio/editar-medio.component';

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
    CategoriasComponent,
    NuevaEntradaComponent,
    EntradasComponent,
    EditarEntradaComponent,
    MediosComponent,
    NuevoMedioComponent,
    BibliotecaMediosComponent,
    EditarMedioComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    AngularFileUploaderModule,
    FroalaEditorModule.forRoot(), 
    FroalaViewModule.forRoot(), 
    FontAwesomeModule, 
    NgbModule
  ],
  providers: [
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
