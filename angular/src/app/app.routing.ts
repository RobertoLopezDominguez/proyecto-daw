//Imports necesarios
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { ErrorComponent } from './componentes/error/error.component';
import { PerfilUsuarioComponent } from './componentes/perfil-usuario/perfil-usuario.component';
import { CategoriasComponent } from './componentes/categorias/categorias.component';
import { NuevaEntradaComponent } from './componentes/nueva-entrada/nueva-entrada.component';
import { EntradasComponent } from './componentes/entradas/entradas.component';
import { EditarEntradaComponent } from './componentes/editar-entrada/editar-entrada.component';
import { MediosComponent } from './componentes/medios/medios.component';
import { EditarMedioComponent } from './componentes/editar-medio/editar-medio.component';

//Definir las rutas
const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout/:cerrar', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'admin', component: AdminComponent},
    {path: 'mi-perfil', component: PerfilUsuarioComponent},
    {path: 'categorias', component: CategoriasComponent},
    {path: 'nueva-entrada', component: NuevaEntradaComponent},
    {path: 'entradas', component: EntradasComponent},
    {path: 'editar-entrada/:id', component: EditarEntradaComponent},
    {path: 'editar-medio/:id', component: EditarMedioComponent},
    {path: 'medios', component: MediosComponent},
    {path: '**', component: ErrorComponent}
]; // ** siempre al final

//Exportar configuración
export const appRoutingProviders: any[] = []; //Cargar rutas como servicio
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);