const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cartao = sequelize.define('Cartao', {
  id_cartao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false, // Ex: "Nubank Roxinho"
  },
  bandeira: {
    type: DataTypes.STRING(50),
    allowNull: false, // Ex: "Visa", "Mastercard"
  },
  limite_total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  limite_disponivel: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  dia_vencimento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 31,
    },
  },
  dia_fechamento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 31,
    },
  },
}, {
  tableName: 'cartoes',
  timestamps: true,
});

// Nota: O relacionamento Cartao.belongsTo(Usuario) foi centralizado no db.js para evitar dependência circular.

module.exports = Cartao;