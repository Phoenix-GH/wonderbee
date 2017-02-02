import Sequelize from 'sequelize';

export default function (sequelize) {
  const flagCommentSchema = sequelize.define('flagComment', {
    userId: {
      type: Sequelize.BIGINT,
    },
    commentId: {
      type: Sequelize.BIGINT,
    },
    flagType: {
      type: Sequelize.ENUM('copywrite', 'nudity', 'profanity', 'racism', 'spam'),
    },
  });

  // sync the defined schema above to the database
  flagCommentSchema.sync();

  return flagCommentSchema;
}
