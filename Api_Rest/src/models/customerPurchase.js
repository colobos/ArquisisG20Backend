'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomerPurchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  CustomerPurchase.init({
    user_id: DataTypes.STRING,
    admin_id: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    symbol: DataTypes.STRING,
    shortName: DataTypes.STRING,
    price: DataTypes.FLOAT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomerPurchase',
    tableName: 'customer_purchase',
    underscored: true 
  });
  return CustomerPurchase;
};

