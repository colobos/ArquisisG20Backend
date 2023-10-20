'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prediction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  Prediction.init({
    user_id: DataTypes.STRING,
    shortname: DataTypes.STRING,
    symbol: DataTypes.STRING,
    prediction_value: DataTypes.FLOAT, 
    state: DataTypes.BOOLEAN,
    amount: DataTypes.INTEGER,
    time: DataTypes.INTEGER,
    precios: DataTypes.ARRAY(DataTypes.FLOAT), 
    dates: DataTypes.ARRAY(DataTypes.DATE), 
    datesimulation: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Prediction',
    tableName: 'prediction',
    underscored: true 
  });
  return Prediction;
};

