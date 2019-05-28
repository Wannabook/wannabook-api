/* eslint-disable camelcase */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      access_tokens: DataTypes.STRING,
      refresh_token: DataTypes.TEXT,
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
