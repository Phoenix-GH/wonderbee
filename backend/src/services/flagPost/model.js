import Sequelize from 'sequelize';

export default function (sequelize) {
  const flagPostSchema = sequelize.define('flagPost', {
    userId: {
      type: Sequelize.BIGINT,
    },
    commentId: {
      type: Sequelize.BIGINT,
    },
    flagType: {
      type: Sequelize.ENUM('copywrite', 'nudity', 'profanity', 'racism', 'spam'),
    }
  });

  // sync the defined schema above to the database
  flagPostSchema.sync();

  return flagPostSchema;
}
