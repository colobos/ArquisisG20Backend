'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stocks', [{
      name: 'APPL',
      amount: 800,
      price: 25.4,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'AMZN',
      amount: 600,
      price: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stocks', null, {});
  }
};
