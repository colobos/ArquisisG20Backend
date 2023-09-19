'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Purchase.init({
    user_id: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    group_id: DataTypes.STRING,
    datetime: DataTypes.STRING,
    stocks_symbol: DataTypes.STRING,
    stocks_shortname: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    location: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Purchase',
    tableName: 'purchase',
    underscored: true 
  });
  return Purchase;
};

