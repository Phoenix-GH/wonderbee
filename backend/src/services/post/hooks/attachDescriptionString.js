export default function () {
  return function attachDescriptionString(hook) {
    if (hook.params.provider) {
      if (hook.method === 'find') {
        hook.result.data.forEach((post, i) => {
          hook.result.data[i].truncated = post.description;
          hook.result.data[i].full = post.description;
          hook.result.data[i].isTruncated = false;
          if (post.description.length > 120) {
            hook.result.data[i].truncated =
              `${post.description.substr(0, 120)} ...[more]`;
            hook.result.data[i].full = post.description;
            hook.result.data[i].isTruncated = true;
          }
        });
      }
    }
  };
}
