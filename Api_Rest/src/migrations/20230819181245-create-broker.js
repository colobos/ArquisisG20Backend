'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Brokers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      stocks_id: {
        type: Sequelize.STRING
      },
      datetime: {
        type: Sequelize.STRING
      },
      stocks_symbol: {
        type: Sequelize.STRING
      },
      stocks_shortname: {
        type: Sequelize.STRING
      },
      stocks_price: {
        type: Sequelize.FLOAT
      },
      stocks_currency: {
        type: Sequelize.STRING
      },
      stocks_source: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Brokers');
  }
};