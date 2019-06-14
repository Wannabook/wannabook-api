/* eslint-disable camelcase */
module.exports = (sequelize, DataTypes) => {
  const Staff = sequelize.define(
    'Staff',
    {
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      title: DataTypes.STRING,
    },
    {}
  );
  Staff.associate = function(models) {
    Staff.belongsTo(models.Organization);
  };

  return Staff;
};
