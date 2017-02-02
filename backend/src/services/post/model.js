import Sequelize from 'sequelize';

export default function (sequelize) {
  const postSchema = sequelize.define('post', {
    userId: {
      type: Sequelize.BIGINT,
    },
    groupId: {
      type: Sequelize.BIGINT,
      defaultValue: null,
    },
    emojiIds: {
      type: Sequelize.ARRAY(Sequelize.BIGINT),
      defaultValue: [1, 2, 3, 4, 5],
    },
    type: {
      type: Sequelize.ENUM('image', 'video', 'mix'),
      defaultValue: 'image',
    },
    layout: {
      type: Sequelize.ENUM('vertical', 'horizontal', 'quad'),
      defaultValue: 'vertical',
    },
    voting: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    visibility: {
      type: Sequelize.ENUM('all', 'followers', 'group'),
      defaultValue: 'all',
    },
    expiresAt: {
      type: Sequelize.DATE,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  // sync the defined schema above to the database
  postSchema.sync();

  return postSchema;
}
