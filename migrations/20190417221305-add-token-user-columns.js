module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('User', 'password', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('User', 'access_tokens', {
          type: Sequelize.BLOB,
        }, { transaction: t }),
        queryInterface.addColumn('User', 'refresh_token', {
          type: Sequelize.TEXT
        }, { transaction: t }),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('User', 'password', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.removeColumn('User', 'access_tokens', {
          type: Sequelize.BLOB,
        }, { transaction: t }),
        queryInterface.removeColumn('User', 'refresh_token', {
          type: Sequelize.TEXT
        }, { transaction: t }),
      ])
    })
  }
};
