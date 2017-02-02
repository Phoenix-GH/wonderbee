import Sequelize from 'sequelize';

export default function (sequelize) {
  const groupUserSchema = sequelize.define('groupUser', {
    groupId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  // sync the defined schema above to the database
  groupUserSchema.sync();

  return groupUserSchema;
}
