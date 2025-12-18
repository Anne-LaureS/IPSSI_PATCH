const sequelize = require('../config/database');
const User = require('./User');

// Initialiser tous les modèles
const models = {
  User,
  sequelize
};

module.exports = models;