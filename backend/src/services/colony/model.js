import Sequelize from 'sequelize';

export default function (sequelize) {
  const colonySchema = sequelize.define('colony', {
    userId: {
      type: Sequelize.BIGINT,
    },
    name: {
      type: Sequelize.STRING,
    },
    users: {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
    },
    hashtags: {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
    },
    locations: {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
    },
    visibility: {
      type: Sequelize.ENUM('all', 'followers', 'private'),
      defaultValue: 'all',
    },
  });

  // sync the defined schema above to the database
  colonySchema.sync();

  return colonySchema;
}
