'use strict';
/* eslint-disable camelcase */

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
    return queryInterface.bulkInsert(
      'Users',
      [
        {
          first_name: 'Dmitry',
          last_name: 'Lipski',
          email: 'dmitry@demo.com',
          password: '123456',
          access_tokens: '',
          refresh_token: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: 'Ilya',
          last_name: 'Kushlianski',
          email: 'ilya@demo.com',
          password: '123456',
          access_tokens: '',
          refresh_token: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  },
};
