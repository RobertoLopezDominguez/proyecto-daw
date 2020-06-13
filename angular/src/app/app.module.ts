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
import { EntradaUnicaComponent } from './componentes/entrada-unica/entrada-unica.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { ContactoComponent } from './componentes/contacto/contacto.component';
import { ContactosComponent } from './componentes/contactos/contactos.component';
import { AdminUsuariosComponent } from './componentes/admin-usuarios/admin-usuarios.component';
import { EditarUsuarioComponent } from './componentes/editar-usuario/editar-usuario.component';

//Importo los Guard para el control de acceso restringido a las páginas
import { AdminGuard } from './servicios/admin.guard';
import { EditorGuard } from './servicios/editor.guard';
import { InvitadoGuard } from './servicios/invitado.guard';
import { UsuarioService } from './servicios/usuario.service';

//Declaro los módulos que voy a utilizar
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    InicioComponent,
    ErrorComponent,
    PerfilUsuarioComponent,
    CategoriasComponent,
    NuevaEntradaComponent,
    EntradasComponent,
    EditarEntradaComponent,
    MediosComponent,
    NuevoMedioComponent,
    BibliotecaMediosComponent,
    EditarMedioComponent,
    EntradaUnicaComponent,
    CategoriaComponent,
    ContactoComponent,
    ContactosComponent,
    AdminUsuariosComponent,
    EditarUsuarioComponent
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
    appRoutingProviders,
    AdminGuard,
    EditorGuard,
    InvitadoGuard,
    UsuarioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
