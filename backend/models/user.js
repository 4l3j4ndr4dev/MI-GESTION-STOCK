const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usersFilePath = path.join(__dirname, '../data/users.json');

class User {
  static async findAll() {
    try {
      const data = await fs.readFile(usersFilePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  static async save(users) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
  }

  static async findByEmail(email) {
    const users = await this.findAll();
    return users.find(user => user.email === email);
  }

  static async create(userData) {
    const users = await this.findAll();

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      id: uuidv4(),
      email: userData.email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await this.save(users);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;