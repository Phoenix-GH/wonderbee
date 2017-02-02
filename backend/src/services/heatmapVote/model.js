import Sequelize from 'sequelize';

export default function (sequelize) {
  const heatmapVoteSchema = sequelize.define('heatmapVote', {
    imageId: {
      type: Sequelize.BIGINT,
    },
    userId: {
      type: Sequelize.BIGINT,
    },
    position: {
      type: Sequelize.JSONB,
    },
  });

  // sync the defined schema above to the database
  heatmapVoteSchema.sync();

  return heatmapVoteSchema;
}
