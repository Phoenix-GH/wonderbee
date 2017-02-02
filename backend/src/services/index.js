import authentication from 'feathers-authentication';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import FacebookTokenStrategy from 'passport-facebook-token';
import Sequelize from 'sequelize';

import auth from './auth';
import geolocation from './geolocation';
import comment from './comment';
import post from './post';
import message from './message';
import user from './user';
import follower from './follower';
import search from './search';
import notification from './notification';
import resetPassword from './resetPassword';
import group from './group';
import colony from './colony';
import category from './category';
import hashtag from './hashtag';
import verification from './verification';
import guest from './guest';
import commentVote from './commentVote';
import heatmapVote from './heatmapVote';
import postVote from './postVote';
import imageVote from './imageVote';
import image from './image';
import groupUser from './group-user';
import postHashtag from './post-hashtag';
import upload from './upload';
import flagComment from './flagComment';
import flagPost from './flagPost';
import flagUser from './flagUser';
import facebook from './facebook';
import imageTag from './imageTag';
import location from './location';
import emoji from './emoji';
import health from './health';
import cache from './cache';


export default function () {
  const app = this;
  const config = app.get('auth');

  // get variables for db connection
  const seqConfig = app.get('db').sequelize;

  const sequelizeOptions = {
    dialect: seqConfig.dialect,
    replication: {
      write: {
        host: seqConfig.write.endpoint,
        username: seqConfig.write.username,
        password: seqConfig.write.password,
        database: seqConfig.database,
        port: seqConfig.port,
      },
      read: [
        {
          host: seqConfig.read.endpoint,
          username: seqConfig.read.username,
          password: seqConfig.read.password,
          database: seqConfig.database,
          port: seqConfig.port,
        },
      ],
    },
  };

  // check if logging is enabled or not
  sequelizeOptions.logging = (seqConfig.logging) ? console.log : false;

  // connect
  const sequelize = new Sequelize(sequelizeOptions);

  app.set('sequelize', sequelize);

  config.facebook.strategy = FacebookStrategy;
  config.facebook.tokenStrategy = FacebookTokenStrategy;

  app.set('auth', config);
  app.configure(authentication(config));
  app.configure(auth);
  app.configure(user);
  app.configure(category);
  app.configure(geolocation);
  app.configure(hashtag);
  app.configure(message);
  app.configure(post);
  app.configure(comment);
  app.configure(follower);
  app.configure(search);
  app.configure(group);
  app.configure(colony);
  app.configure(notification);
  app.configure(resetPassword);
  app.configure(verification);
  app.configure(commentVote);
  app.configure(heatmapVote);
  app.configure(postVote);
  app.configure(image);
  app.configure(imageVote);
  app.configure(guest);
  app.configure(postHashtag);
  app.configure(groupUser);
  app.configure(upload);
  app.configure(flagComment);
  app.configure(flagPost);
  app.configure(flagUser);
  app.configure(facebook);
  app.configure(imageTag);
  app.configure(location);
  app.configure(emoji);
  app.configure(health);
  app.configure(cache);

  const models = sequelize.models;
  Object.keys(models)
    .map(name => models[name])
    .filter(model => model.associate)
    .forEach(model => model.associate(models));
  sequelize.sync();
}
