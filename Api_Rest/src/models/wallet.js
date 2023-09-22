'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  Wallet.init({
    user_id: DataTypes.STRING,
    money: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Wallet',
    tableName: 'wallet',
    underscored: true 
  });
  return Wallet;
};