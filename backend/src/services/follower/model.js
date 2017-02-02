import Sequelize from 'sequelize';

export default function (sequelize) {
  const followerSchema = sequelize.define('follower', {
    userId: {
      type: Sequelize.BIGINT,
    },
    followUserId: {
      type: Sequelize.BIGINT,
    },
    approved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  // sync the defined schema above to the database
  followerSchema.sync();

  return followerSchema;
}
