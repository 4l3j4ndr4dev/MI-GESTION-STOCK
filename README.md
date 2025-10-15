## MI-GESTION-STOCK
API RESTful desarrollada para el cierre del módulo de Backend con Node.js.  
Aplicación backend en Node.js con Express para gestionar un inventario de productos, con autenticación JWT y frontend integrado.
Trabajo Práctico Integrador
## Características

- ✅ API RESTful completa
- ✅ Autenticación JWT
- ✅ CRUD de productos
- ✅ Frontend integrado
- ✅ Despliegue en Render

## Estructura del proyecto
    mi-gestion-stock/
    ├── backend/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── data/
    │   └── index.js
    ├── public/
    │   ├── index.html
    │   ├── styles.css
    │   └── app.js
    ├── .env
    ├── .gitignore
    ├── package.json
    └── README.md

## Instrucciones de instalación y ejecución

## Requisitos previos
- [Node.js](https://nodejs.org/) (v18 o superior)
- [Git](https://git-scm.com/) (para clonar el repositorio, opcional si ya tienes el código)

## 1. Clonar el repositorio (si aplica)
```bash
git clone https://github.com/tu-usuario/mi-gestion-stock.git
cd mi-gestion-stock

## Documentación de la API
La API incluye endpoints para autenticación y gestión de productos.
Puedes explorar la documentación directamente en el endpoint:

http://localhost:3000/api

Una vez el servidor esté corriendo, esta ruta muestra todos los endpoints disponibles, ejemplos y descripciones.

Endpoints principales:
POST /users/register – Registrar un nuevo usuario
POST /users/login – Iniciar sesión y obtener token JWT
GET /items – Listar todos los productos (requiere token)
POST /items – Crear un nuevo producto (requiere token)
PUT /items/:id – Actualizar un producto (requiere token)
DELETE /items/:id – Eliminar un producto (requiere token)
Todos los endpoints de productos requieren el header:
Authorization: Bearer <tu_token> 

##Tecnologías utilizadas
Node.js
Express
JSON Web Tokens (JWT)
Middleware de autenticación
Archivos estáticos (frontend en public/)








