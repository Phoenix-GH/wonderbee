export default function () {
  return function cleanResponse(hook) {
    // return hashed name of file to save in database for correlating duplicate images
    hook.result.name = hook.result.id.split('/').pop();

   // prepend result url with base s3 endpoint from config
   hook.result.url = `${hook.app.get('aws').s3.base_url}/${hook.result.id}`;

   // set with and height
   hook.result.width = hook.data.width;
   hook.result.height = hook.data.height;

   // remove un-necessary items
    delete hook.result.uri;
    delete hook.result.id;

    return hook;
  };
}
