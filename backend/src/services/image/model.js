import Sequelize from 'sequelize';

export default function (sequelize) {
  const imageSchema = sequelize.define('image', {
    postId: {
      type: Sequelize.BIGINT,
    },
    order: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    textOverlays: {
      type: Sequelize.ARRAY(Sequelize.JSONB),
    },
    locationId: {
      type: Sequelize.BIGINT,
    },
    url: {
      type: Sequelize.STRING,
    },
    heatMapUrl: {
      type: Sequelize.STRING,
    },
    width: {
      type: Sequelize.INTEGER,
      default: 1000,
    },
    height: {
      type: Sequelize.INTEGER,
      default: 1000,
    },
  });

  // sync the defined schema above to the database
  imageSchema.sync();

  return imageSchema;
}
