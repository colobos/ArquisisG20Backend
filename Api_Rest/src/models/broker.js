'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Broker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Broker.init({
    stocks_id: DataTypes.STRING,
    datetime: DataTypes.STRING,
    stocks_symbol: DataTypes.STRING,
    stocks_shortname: DataTypes.STRING,
    stocks_price: DataTypes.FLOAT,
    stocks_currency: DataTypes.STRING,
    stocks_source: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Broker',
    underscored: true 
  });
  return Broker;
};