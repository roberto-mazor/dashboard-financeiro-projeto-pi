const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cartao = sequelize.define('Cartao', {
  id_cartao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id_usuario',
    },
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  bandeira: {
    type: DataTypes.STRING(50),
    allowNull: false,
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
  // 👇 Adicione a coluna status aqui
  status: {
    type: DataTypes.INTEGER, // ou DataTypes.SMALLINT
    allowNull: false,
    defaultValue: 1, // 1 = Ativo, 0 = Inativo (Soft Delete)
  },
}, {
  tableName: 'cartoes',
  timestamps: true,
});

module.exports = Cartao;