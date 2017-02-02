import Sequelize from 'sequelize';

export default function (sequelize) {
  const locationSchema = sequelize.define('location', {
    name: {
      type: Sequelize.STRING,
    },
    latitude: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL,
      allowNull: true,
    },
    type: {
      type: Sequelize.ENUM('city', 'place'),
      defaultValue: 'city',
    },
  });

  // sync the defined schema above to the database
  locationSchema.sync();

  return locationSchema;
}
