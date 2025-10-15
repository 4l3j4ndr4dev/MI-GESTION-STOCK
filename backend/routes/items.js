const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { caseInsensitiveQuery } = require('../middleware/queryMiddleware');
const { caseInsensitiveBody } = require('../middleware/queryMiddleware');

// Aplicar case insensitive a las consultas de búsqueda (SOLO GET)
router.get('/', caseInsensitiveQuery, getAllProducts);

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /items/:id - Obtiene un elemento específico
router.get('/:id', getProductById);

// POST /items - Agrega un nuevo elemento (con case insensitive para body)
router.post('/', caseInsensitiveBody, createProduct);

// PUT /items/:id - Edita un elemento existente (con case insensitive para body)
router.put('/:id', caseInsensitiveBody, updateProduct);

// DELETE /items/:id - Elimina un elemento
router.delete('/:id', deleteProduct);

module.exports = router;