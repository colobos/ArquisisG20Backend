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
      this.belongsTo(sequelize.models.Purchase, {
        foreignKey: 'request_id',
        targetKey: 'request_id',
      });
    }
  }

  Validation.init({
    request_id: DataTypes.STRING,
    valid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Validation',
    tableName: 'validation',
    underscored: true 
  });
  return Validation;
};