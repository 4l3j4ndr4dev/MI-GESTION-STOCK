const User = require('../models/user');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    const user = await User.create({ email, password });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Credenciales inválidas');
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

module.exports = {
  register,
  login
};