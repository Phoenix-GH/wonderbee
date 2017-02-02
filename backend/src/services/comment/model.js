import Sequelize from 'sequelize';

export default function (sequelize) {
  const commentSchema = sequelize.define('comment', {
    userId: {
      type: Sequelize.BIGINT,
    },
    postId: {
      type: Sequelize.BIGINT,
    },
    parentId: {
      type: Sequelize.BIGINT,
    },
    imageId: {
      type: Sequelize.BIGINT,
    },
    weight: {
      type: Sequelize.INTEGER,
    },
    position: {
      type: Sequelize.JSONB,
    },
    comment: {
      type: Sequelize.TEXT,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  }, {
    classMethods: {
      associate(models) {
        commentSchema.hasMany(models.commentVotes);
      },
    },
  });

  // sync the defined schema above to the database
  commentSchema.sync();

  return commentSchema;
}
