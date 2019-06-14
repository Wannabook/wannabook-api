/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      access_tokens: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      refresh_token: DataTypes.JSON,
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.toJSON = function() {
    const user = this;

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  };

  User.prototype.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });

    user.access_tokens = user.access_tokens.concat({ token });
    await user.save();

    return token;
  };

  User.findByCredentials = async (email, password) => {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Wrong password');
    }

    return user;
  };

  User.addHook('beforeCreate', async user => {
    user.password = await bcrypt.hash(user.password, 8);
  });

  return User;
};
