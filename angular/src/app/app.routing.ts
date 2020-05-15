//Imports necesarios
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { ErrorComponent } from './componentes/error/error.component';

//Definir las rutas
const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'login', component: LoginComponent},
    {path: 'logout/:cerrar', component: LoginComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'admin', component: AdminComponent},
    {path: '**', component: ErrorComponent}
]; // ** siempre al final

//Exportar configuración
export const appRoutingProviders: any[] = []; //Cargar rutas como servicio
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);