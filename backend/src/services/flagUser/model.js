import Sequelize from 'sequelize';

export default function (sequelize) {
  const flagUserSchema = sequelize.define('flagUser', {
    userId: {
      type: Sequelize.BIGINT,
    },
    flagUserId: {
      type: Sequelize.BIGINT,
    },
    flagType: {
      type: Sequelize.ENUM('copywrite', 'nudity', 'profanity', 'racism', 'spam'),
    },
  });

  // sync the defined schema above to the database
  flagUserSchema.sync();

  return flagUserSchema;
}
