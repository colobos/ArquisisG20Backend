'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Auctions', [{
      "auction_id": "uuid_test_offer1",
      "proposal_id": "",
      "stock_id": "uuid_test_offer1",
      "quantity": 50,
      "group_id": 61,
      "type": "offer",
      createdAt: new Date(),
      updatedAt: new Date()},
      {
        "auction_id": "uuid_test_offer2",
        "proposal_id": "",
        "stock_id": "APPL",
        "quantity": 300,
        "group_id": 20,
        "type": "offer",
        createdAt: new Date(),
        updatedAt: new Date()},
      {
      "auction_id": "uuid_test_offer2",
      "proposal_id": "uuid_test_proposal",
      "stock_id": "AMZN",
      "quantity": 500,
      "group_id": 61,
      "type": "proposal",
      createdAt: new Date(),
      updatedAt: new Date()},
      {
        "auction_id": "uuid_test_acceptance",
        "proposal_id": "uuid_test_acceptance",
        "stock_id": "uuid_test_acceptance",
        "quantity": 30,
        "group_id": 61,
        "type": "acceptance",
        createdAt: new Date(),
        updatedAt: new Date()},
        {
          "auction_id": "uuid_test_rejection",
          "proposal_id": "uuid_test_rejection",
          "stock_id": "uuid_test_rejection",
          "quantity": 30,
          "group_id": 61,
          "type": "rejection",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          "auction_id": "uuid_test_pending",
          "proposal_id": "uuid_test_pending",
          "stock_id": "uuid_test_pending",
          "quantity": 30,
          "group_id": 61,
          "type": "pending",
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Auctions', null, {});
  }
};
