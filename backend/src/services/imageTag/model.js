import Sequelize from 'sequelize';

export default function (sequelize) {
  const imageTagSchema = sequelize.define('imageTag', {
    imageId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
    text: {
      type: Sequelize.STRING,
    },
    x: {
      type: Sequelize.FLOAT,
    },
    y: {
      type: Sequelize.FLOAT,
    },
  });

  // sync the defined schema above to the database
  imageTagSchema.sync();

  return imageTagSchema;
}
