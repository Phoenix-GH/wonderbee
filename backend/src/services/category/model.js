import Sequelize from 'sequelize';

export default function (sequelize) {
  const categorySchema = sequelize.define('category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
    },
  });

  // sync the defined schema above to the database
  categorySchema.sync();

  return categorySchema;
}
