//Imports necesarios
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { ErrorComponent } from './componentes/error/error.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { NuevaEntradaComponent } from './componentes/nueva-entrada/nueva-entrada.component';
import { EntradasComponent } from './componentes/entradas/entradas.component';
import { EditarEntradaComponent } from './componentes/editar-entrada/editar-entrada.component';
import { MediosComponent } from './componentes/medios/medios.component';
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

//Definir las rutas
const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout/:cerrar', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'mi-perfil', component: PerfilUsuarioComponent, canActivate: [InvitadoGuard]},
    {path: 'categorias', component: CategoriasComponent, canActivate: [EditorGuard]},
    {path: 'nueva-entrada', component: NuevaEntradaComponent, canActivate: [EditorGuard]},
    {path: 'entradas', component: EntradasComponent, canActivate: [EditorGuard]},
    {path: 'editar-entrada/:id', component: EditarEntradaComponent, canActivate: [EditorGuard]},
    {path: 'editar-medio/:id', component: EditarMedioComponent, canActivate: [EditorGuard]},
    {path: 'medios', component: MediosComponent, canActivate: [EditorGuard]},
    {path: 'entrada/:id', component: EntradaUnicaComponent},
    {path: 'categoria/:id', component: CategoriaComponent},
    {path: 'contacto', component: ContactoComponent},
    {path: 'contactos', component: ContactosComponent, canActivate: [AdminGuard]},
    {path: 'admin-usuarios', component: AdminUsuariosComponent, canActivate: [AdminGuard]},
    {path: 'editar-usuario/:id', component: EditarUsuarioComponent, canActivate: [AdminGuard]},
    {path: '**', component: ErrorComponent}
]; // ** siempre al final

//Exportar configuración
export const appRoutingProviders: any[] = []; //Cargar rutas como servicio
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);