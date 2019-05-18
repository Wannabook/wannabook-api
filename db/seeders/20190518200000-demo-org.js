'use strict';
/* eslint-disable camelcase */

const faker = require('faker');
faker.locale = 'ru';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    const organizations = [];

    for (let i = 0; i < 10; i++) {
      const org = {};
      const name = faker.company.companyName();

      org.legal_name = (Math.random() > 0.5 ? 'ООО ' : 'ОАО ') + name;
      org.name = name;
      org.description = faker.lorem.sentence();
      org.contact_email = faker.internet.email();
      org.contact_phone = faker.phone.phoneNumber();
      org.location_city = 'Минск';
      org.location_addr = faker.address.streetAddress();
      org.location_lat = faker.address.latitude();
      org.location_long = faker.address.longitude();
      org.createdAt = new Date();
      org.updatedAt = new Date();

      organizations.push(org);
    }

    return queryInterface.bulkInsert('Organizations', organizations, {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Organizations', null, {});
  },
};
