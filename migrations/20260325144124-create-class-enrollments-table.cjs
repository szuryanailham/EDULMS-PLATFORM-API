"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_enrollments', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      class_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      invitation_code_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      enrolled_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
    await queryInterface.addConstraint('class_enrollments', {
      fields: ['user_id', 'class_id'],
      type: 'unique',
      name: 'unique_user_class_enrollment'
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('class_enrollments');
  }
};
