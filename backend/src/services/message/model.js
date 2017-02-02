import Sequelize from 'sequelize';

export default function (sequelize) {
  const messageSchema = sequelize.define('message', {
    userId: {
      type: Sequelize.BIGINT,
    },
    groupId: {
      type: Sequelize.BIGINT,
    },
    content: {
      type: Sequelize.TEXT,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
    },
  });

  // sync the defined schema above to the database
  messageSchema.sync();

  return messageSchema;
}
