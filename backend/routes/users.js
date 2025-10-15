const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { caseInsensitiveBody } = require('../middleware/queryMiddleware');

// Aplicar case insensitive SOLO a las rutas que necesitan body
router.post('/register', caseInsensitiveBody, register);
router.post('/login', caseInsensitiveBody, login);

module.exports = router;