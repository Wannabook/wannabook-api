'use strict';
/* eslint-disable camelcase */

const faker = require('faker');
faker.locale = 'ru';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const staff = [];

    for (let i = 0; i < 60; i++) {
      const person = {};
      person.first_name = faker.name.firstName();
      person.last_name = faker.name.lastName();
      person.email = faker.internet.email();
      person.phone = faker.phone.phoneNumber();
      person.title = faker.name.jobTitle();
      person.OrganizationId = getRandomInt(1, 10);

      person.createdAt = new Date();
      person.updatedAt = new Date();

      staff.push(person);
    }

    return queryInterface.bulkInsert('Staffs', staff, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Staffs', null, {});
  },
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
