const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

// Importar middlewares divididos
const { authenticateToken } = require('./middleware/authMiddleware');
const { 
  errorHandler, 
  notFoundHandler, 
  malformedRequestHandler 
} = require('./middleware/errorMiddleware');
const { 
  caseInsensitiveQuery, 
  caseInsensitiveBody 
} = require('./middleware/queryMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales - ORDEN CORRECTO
app.use(cors());
app.use(express.json()); // ← PRIMERO express.json() para parsear el body
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(malformedRequestHandler); // ← DESPUÉS de express.json()
app.use(caseInsensitiveBody);     // ← DESPUÉS de express.json()

// Importar rutas
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

// Usar rutas
app.use('/users', userRoutes);
app.use('/items', itemRoutes);

// Ruta para documentación de la API
app.get('/api', (req, res) => {
  res.json({
    message: '🚀 API de Gestión de Stock - Trabajo Práctico Integrador',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /users/register': 'Registrar nuevo usuario',
        'POST /users/login': 'Iniciar sesión y obtener token'
      },
      products: {
        'GET /items': 'Obtener todos los productos',
        'GET /items/:id': 'Obtener producto por ID',
        'POST /items': 'Crear nuevo producto (requiere auth)',
        'PUT /items/:id': 'Actualizar producto (requiere auth)',
        'DELETE /items/:id': 'Eliminar producto (requiere auth)'
      }
    }
  });
});

// Ruta principal - Frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Middleware para rutas no encontradas (DEBE IR AL FINAL)
app.use(notFoundHandler);

// Middleware para manejo de errores (DEBE SER EL ÚLTIMO)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});