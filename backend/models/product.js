const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const productsFilePath = path.join(__dirname, '../data/products.json');

class Product {
  static async findAll() {
    try {
      const data = await fs.readFile(productsFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async save(products) {
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
  }

  static async findById(id) {
    const products = await this.findAll();
    return products.find(product => product.id === id);
  }

  static async create(productData) {
    const products = await this.findAll();

    const newProduct = {
      id: uuidv4(),
      name: productData.name,
      description: productData.description || '',
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      category: productData.category || 'general',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(newProduct);
    await this.save(products);

    return newProduct;
  }

  static async update(id, productData) {
    const products = await this.findAll();
    const productIndex = products.findIndex(product => product.id === id);

    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    products[productIndex] = {
      ...products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString()
    };

    await this.save(products);
    return products[productIndex];
  }

  static async delete(id) {
    const products = await this.findAll();
    const filteredProducts = products.filter(product => product.id !== id);

    if (products.length === filteredProducts.length) {
      throw new Error('Producto no encontrado');
    }

    await this.save(filteredProducts);
    return true;
  }
}

module.exports = Product;