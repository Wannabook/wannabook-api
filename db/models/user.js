/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      picture: {
        type: DataTypes.STRING,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      access_tokens: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.toJSON = function() {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
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

  User.findByEmail = async email => {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new Error('Unable to login');
    }

    return user;
  };

  User.prototype.addAccessToken = function(token) {
    const user = this;
    user.access_tokens = user.access_tokens.concat(token);

    return user.save();
  };

  User.prototype.updateRefreshToken = function(tokens) {
    const user = this;
    user.refresh_token = tokens.refresh_token;

    return user.save();
  };

  User.prototype.removeAccessToken = function(token) {
    const user = this;
    user.access_tokens = user.access_tokens.filter(t => t !== token);

    return user.save();
  };

  User.prototype.removeOldAccessTokens = function() {
    const user = this;
    user.access_tokens = [];

    return user.save();
  };

  User.addHook('beforeCreate', async user => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  return User;
};
