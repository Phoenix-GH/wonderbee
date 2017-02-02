import BlobService from 'feathers-blob';
import AWS from 'aws-sdk';
import S3BlobStore from 's3-blob-store';
import { before, after } from './hooks';

export default function init() {
  const app = this;

  // setup s3 auth details
  const s3 = new AWS.S3({
    accessKeyId: app.get('aws').s3.accessKeyId,
    secretAccessKey: app.get('aws').s3.secretAccessKey,
  });

  // setup blob storage
  const blobStore = S3BlobStore({
    client: s3,
    bucket: app.get('aws').s3.bucket,
  });

  const blobService = BlobService({
    Model: blobStore,
  });

  // Upload Service
  app.use('/uploads', blobService);

  // set a custom socketio timeout value
  app.service('uploads').timeout = 30000;

  // Setup hooks
  app.service('uploads').before(before).after(after);
}
