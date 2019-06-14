/* eslint-disable camelcase */
module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    'Organization',
    {
      legal_name: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      contact_email: DataTypes.STRING,
      contact_phone: DataTypes.STRING,
      location_city: DataTypes.STRING,
      location_addr: DataTypes.STRING,
      location_lat: DataTypes.FLOAT(11, 10),
      location_long: DataTypes.FLOAT(11, 10),
      createdAt: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      },
      updatedAt: {
        type: DataTypes.DATE(3),
        defaultValue: sequelize.literal(
          'CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)'
        ),
      },
    },
    {}
  );
  Organization.associate = function(models) {
    Organization.hasMany(models.Staff);
  };

  return Organization;
};
