'use strict';
/* eslint-disable camelcase */

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      legal_name: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      contact_email: {
        type: Sequelize.STRING,
      },
      contact_phone: {
        type: Sequelize.STRING,
      },
      location_city: {
        type: Sequelize.STRING,
      },
      location_addr: {
        type: Sequelize.STRING,
      },
      location_lat: {
        type: Sequelize.STRING, // should be fixed to accept floats
      },
      location_long: {
        type: Sequelize.STRING, // should be fixed to accept floats
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Organizations');
  },
};
