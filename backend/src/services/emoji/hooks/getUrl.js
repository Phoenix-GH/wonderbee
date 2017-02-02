export default function () {
  return function getUrl(hook) {
    hook.result.forEach((result, i) => {
      hook.result[i].url = `${hook.app.get('aws').s3.base_url}/emoji/png_64/${result.unicode}`;
    });
    return hook;
  };
}
