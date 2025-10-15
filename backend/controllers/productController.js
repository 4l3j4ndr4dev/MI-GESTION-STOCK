const Product = require('../models/Product');

// GET /items - Lista elementos (el case insensitive ya lo hace el middleware)
const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll();

    // La búsqueda ya viene normalizada del middleware
    if (req.query.search) {
      const searchTerm = req.query.search; // Ya está en minúsculas
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }

    res.json({
      count: products.length,
      products
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      throw new Error('Producto no encontrado'); // ← El middleware manejará este error
    }

    res.json(product);

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price || !stock) {
      throw new Error('Nombre, precio y stock son requeridos');
    }

    if (price < 0 || stock < 0) {
      throw new Error('Precio y stock no pueden ser negativos');
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category
    });

    res.status(201).json({
      message: 'Producto creado exitosamente',
      product
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.update(req.params.id, {
      name,
      description,
      price,
      stock,
      category
    });

    res.json({
      message: 'Producto actualizado exitosamente',
      product
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await Product.delete(req.params.id);

    res.json({
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    next(error); // ← Pasar el error al middleware de errores
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};