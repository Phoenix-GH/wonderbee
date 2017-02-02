import Sequelize from 'sequelize';

export default function (sequelize) {
  const hashtagSchema = sequelize.define('hashtag', {
    categoryId: {
      type: Sequelize.BIGINT,
      defaultValue: null,
    },
    name: {
      type: Sequelize.STRING,
    },
  });

  // sync the defined schema above to the database
  hashtagSchema.sync();

  return hashtagSchema;
}
