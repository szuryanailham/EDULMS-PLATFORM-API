'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('classes', 'url');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('classes', 'url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};