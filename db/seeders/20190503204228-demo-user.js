'use strict';

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
          firstName: 'Dmitry',
          lastName: 'Lipski',
          email: 'dmitry@demo.com',
          password: '123456',
          access_tokens: '[]',
          refresh_token: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstName: 'Ilya',
          lastName: 'Kushlianski',
          email: 'ilya@demo.com',
          password: '123456',
          access_tokens: '[]',
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
