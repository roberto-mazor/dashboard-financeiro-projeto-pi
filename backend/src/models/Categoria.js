const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Categoria = sequelize.define('Categoria', {
  id_categoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('Receita', 'Despesa'),
    allowNull: false
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios', // Alterado para string para evitar carregar o arquivo Usuario.js aqui
      key: 'id_usuario'
    }
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'categorias',
  timestamps: false 
});

// Nota: O relacionamento Categoria.belongsTo(Usuario) e Categoria.hasMany(Transacao)
// foram centralizados com sucesso no arquivo db.js.

module.exports = Categoria;