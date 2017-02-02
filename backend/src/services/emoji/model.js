import Sequelize from 'sequelize';

export default function (sequelize) {
  const emojiSchema = sequelize.define('emoji', {
    category: {
      type: Sequelize.STRING,
    },
    unicode: {
      type: Sequelize.STRING,
    },
    keywords: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    width: {
      type: Sequelize.INTEGER,
    },
    height: {
      type: Sequelize.INTEGER,
    },
  });

  // sync the defined schema above to the database
  emojiSchema.sync();

  return emojiSchema;
}
