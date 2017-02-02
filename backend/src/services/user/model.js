import Sequelize from 'sequelize';

export default function (sequelize) {
  const userSchema = sequelize.define('user', {
    avatarUrl: {
      type: Sequelize.STRING(2000),
    },
    name: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING(64),
    },
    email: {
      type: Sequelize.STRING,
    },
    rawGmail: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      set(mail) {
        const username = mail.split('@')[0].replace(/\./g, '');
        this.setDataValue('rawGmail', username);
      },
    },
    gender: {
      type: Sequelize.ENUM('male', 'female'),
    },
    yearOfBirth: {
      type: Sequelize.INTEGER,
    },
    dialCode: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    bio: {
      type: Sequelize.STRING,
    },
    locationId: {
      type: Sequelize.BIGINT,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    private: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    displayLocation: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    textSize: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    notificationSettings: {
      type: Sequelize.JSONB,
    },
    snsTargetArns: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    passwordResetToken: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    facebookUserId: {
      type: Sequelize.STRING,
    },
    facebookOAuthToken: {
      type: Sequelize.STRING,
    },
    facebookOAuthTokenExpiresAt: {
      type: Sequelize.BIGINT,
    },
  });

  // sync the defined schema above to the database
  userSchema.sync();

  return userSchema;
}
