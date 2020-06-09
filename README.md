# proyecto-daw
Repositorio del módulo de Proyecto de DAW

Título: Back-end realizado en una SPA con Laravel y Angular
Autor: Roberto López Domínguez

INSTRUCCIONES PARA EL CORRECTO FUNCIONAMIENTO EN DESARROLLO

1. Conexión con la Base de Datos.
   
   Los datos de conexión con la base de datos deben introducirse
   en el siguiente archivo de Laravel:
   
   /laravel/.env
   
2. VirtualHost para las peticiones al servidor
   
   Es necesario configurar un virtualhost que apunte al siguiente
   directorio:
   
   /laravel/public
   
   En el desarrollo del proyecto he usado el siguiente:
   ServerName : proyecto-daw-laravel
   Directory  : w:/proyecto_daw/html/laravel/public
   
3. Configuración de la URL para las peticiones asíncronas
   
   Es necesario indicarle a Angular cuál es la URL base a la
   que hacer las peticiones. 
   
   Esta se encuentra en una variable en el servicio Global.
   
   /angular/src/app/servicios/global.ts
   
   En el desarrollo del presente proyecto es la siguiente:
   
   url: 'http://proyecto-daw-laravel/api/'
   
4. Compilación de Angular
   
   La aplicación Angular en desarrollo debe ser compilada para
   ser accesible. Angular dispone de un servidor web que complila 
   la aplicación.
   
   Desde el directorio raíz de Angular (/angular) se debe ejecutar
   el siguiente comando en una terminal:
   
   ng serve
   
   Una vez compilado se puede acceder a la aplicación web desde la
   URL:
   
   http://localhost:4200/