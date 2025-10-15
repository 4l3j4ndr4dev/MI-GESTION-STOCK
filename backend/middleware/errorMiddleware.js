// Middleware para manejar errores
const errorHandler = (error, req, res, next) => {
  console.error('🔴 Error del servidor:', error.message);

  // Errores de validación
  if (error.message.includes('requerido') || error.message.includes('debe tener')) {
    return res.status(400).json({
      error: error.message
    });
  }

  // Errores de recurso no encontrado
  if (error.message.includes('no encontrado') || error.message.includes('no existe')) {
    return res.status(404).json({
      error: error.message
    });
  }

  // Error de credenciales inválidas
  if (error.message.includes('Credenciales inválidas')) {
    return res.status(401).json({
      error: error.message
    });
  }

  // Error de usuario ya existe
  if (error.message.includes('El usuario ya existe')) {
    return res.status(400).json({
      error: error.message
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Algo salió mal'
  });
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
};

// Middleware para manejar solicitudes malformadas
const malformedRequestHandler = (req, res, next) => {
  // Solo verificar si el content-type es JSON y hay body
  if (req.is('application/json') && req.body && Object.keys(req.body).length > 0) {
    try {
      JSON.parse(JSON.stringify(req.body));
    } catch (err) {
      return res.status(400).json({
        error: 'Solicitud JSON malformada'
      });
    }
  }
  next();
};

module.exports = {
  errorHandler,
  notFoundHandler,
  malformedRequestHandler
};