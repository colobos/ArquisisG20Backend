'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Validation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  Validation.init({
    request_id: DataTypes.STRING,
    group_id: DataTypes.STRING,
    seller: DataTypes.FLOAT,
    valid: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Validation',
    tableName: 'validation',
    underscored: true 
  });
  return Validation;
};