import Sequelize from 'sequelize';

export default function (sequelize) {
  const groupSchema = sequelize.define('group', {
    userId: {
      type: Sequelize.BIGINT,
    },
    hidden: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    avatarUrl: {
      type: Sequelize.STRING(2000),
    },
    groupMemberHash: {
      type: Sequelize.STRING(64),
    },
    deleted: {
      type: Sequelize.BOOLEAN,
    },
  });

  // sync the defined schema above to the database
  groupSchema.sync();

  return groupSchema;
}
