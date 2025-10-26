Este es un Proyecto originado en Sololearn como skiljuan con un html y un css para dar estilo a una pagina de muestra.
Subido a Replit y luego creado un repositorio en github para gestionar los cambios a traves de git.
Igualmente la idea era ademas vincular a un repositorio local en mi pc y a traves de Git hacer una nueva rama para 
despues practicar Git Merge y todos los comandos de uso practico en Git-
Parece que la opcion de usar ssh key es paga

-Este cambio lo hice en replit para hacer un commit al repo remoto
-Este cambio lo hice desde replit app y hago commit al repo remoto de github.


Nota: Hacer siempre un commit desde el repositorio local hacia github.

** NO HACER PUSH DESDE REPLIT ** SOLO HACER PULL desde github

En Replit, hay que modificar lo siguiente:

-proyectos.js : sacar el local host y dejar solo la ruta /proy/digitales.



Incorporé un CARRITO DE COMPRAS vinculando la bd de stock a otra app de replit con la cual gestiono a traves de google sheets tablas para realizar
compras de productos para mantener el stock. El mismo se muestra en una tabla con colores tipo semaforo para alertar las cantidades de productos
que necesitan reposicion. Una vez realizada la compra se registra en google sheets y se actualiza el stock. Haciendo correr la app de replit, se
toman esos valores de la tabla y se actualiza la base de datos mysql con las cantidades de stock correctas. Luego haciendo correr la app tanto en 
del contenedor de Docker o desde local, se ve actualizados los datos de stock.

El contenedor de docker tambien fue incorporado para correrlo en otra pc.

Se incorporó automatizacion de test a travez de CYPRESS 
Y con el Test Case (hola_hola.js)
un a prueba de multiples promps de nombre y edad simulados.
Y con el Test Case de login (hola_hola2.js)
-usuario valido
-usuario invalido
Para luego validar el ingreso a /proyectosDigitales.html 



Nota: Hacer siempre un commit desde el repositorio local hacia github.

** NO HACER PUSH DESDE REPLIT ** SOLO HACER PULL desde github

En Replit, hay que modificar lo siguiente:

-proyectos.js : sacar el local host y dejar solo la ruta /proy/digitales.

*************************************

Esta aplicación es una plataforma web de portafolio y e-commerce de proyectos digitales/arquitectónicos con las siguientes funcionalidades principales:

Funciones Principales:
1. Gestión de Portafolio de Proyectos
Muestra proyectos digitales y arquitectónicos en formato de cards y tablas
Permite visualizar detalles completos de cada proyecto (nombre, descripción, precio, imágenes)
Sistema CRUD completo para administrar proyectos (crear, leer, actualizar, eliminar)
2. Sistema de Autenticación y Autorización
Login y registro de usuarios con validación
Sistema de sesiones (express-session) y JWT tokens
Control de roles (administrador vs usuario regular)
Restricción de acceso según permisos (solo administradores pueden modificar/eliminar proyectos)
3. Carrito de Compras
Los usuarios pueden agregar proyectos al carrito
Control de cantidades dinámico (incrementar/decrementar)
Cálculo automático de subtotales y total general
Sistema de checkout para confirmar órdenes
Gestión del carrito mediante sesiones
4. Gestión de Imágenes
Upload de imágenes con Multer
Procesamiento y redimensionamiento de imágenes con Sharp
Validación de tipo y tamaño de archivo
5. Base de Datos MySQL
Almacena productos con relación a tipos y stock
Gestión de usuarios y sus roles
Consultas con JOINs para obtener información completa
6. Validaciones
Express-validator para validar formularios
Validaciones en frontend con JavaScript
Sanitización de datos (escape)
7. Interfaz de Usuario
Vistas dinámicas con EJS
Diseño responsive con CSS
JavaScript vanilla para interactividad del lado del cliente
Formularios para contacto y gestión de datos
La aplicación funciona como un portafolio profesional que combina la presentación de trabajos (arquitectura/desarrollo) con capacidades de e-commerce para vender o mostrar proyectos.