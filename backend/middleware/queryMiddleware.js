// Middleware para hacer consultas case insensitive
const caseInsensitiveQuery = (req, res, next) => {
  // Aplicar case insensitive a parámetros de búsqueda
  if (req.query && req.query.search) {
    req.query.search = req.query.search.toLowerCase();
  }

  // Aplicar case insensitive a parámetros de ordenamiento si existen
  if (req.query && req.query.sort) {
    req.query.sort = req.query.sort.toLowerCase();
  }

  // Aplicar case insensitive a parámetros de filtro si existen
  if (req.query && req.query.category) {
    req.query.category = req.query.category.toLowerCase();
  }

  next();
};

// Middleware para normalizar body en ciertos casos
const caseInsensitiveBody = (req, res, next) => {
  // Solo procesar si existe req.body
  if (req.body) {
    // Normalizar email a minúsculas
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase().trim();
    }

    // Normalizar categoría de productos
    if (req.body.category) {
      req.body.category = req.body.category.toLowerCase().trim();
    }

    // Normalizar nombre de producto (opcional)
    if (req.body.name) {
      req.body.name = req.body.name.trim();
    }
  }
  
  next();
};

module.exports = {
  caseInsensitiveQuery,
  caseInsensitiveBody
};