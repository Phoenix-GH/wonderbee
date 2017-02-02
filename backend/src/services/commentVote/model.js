import Sequelize from 'sequelize';

export default function (sequelize) {
  const commentVotesSchema = sequelize.define('commentVotes', {
    commentId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
    value: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
  }, {
    classMethods: {
      associate(models) {
        commentVotesSchema.belongsTo(models.comment);
      },
    },
  });

  // sync the defined schema above to the database
  commentVotesSchema.sync();

  return commentVotesSchema;
}
