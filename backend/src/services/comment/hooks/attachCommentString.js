export default function () {
  return function attachCommentString(hook) {
    if (hook.params.provider) {
      if (hook.method === 'find') {
        hook.result.data.forEach((comment, i) => {
          hook.result.data[i].truncated = comment.comment;
          hook.result.data[i].full = comment.comment;
          hook.result.data[i].isTruncated = false;
          if (comment.comment.length > 120) {
            hook.result.data[i].truncated =
              `${comment.comment.substr(0, 120)} ...[more]`;
            hook.result.data[i].full = comment.comment;
            hook.result.data[i].isTruncated = true;
          }
        });
      }
      if (hook.method === 'create') {
        hook.result.truncated = hook.result.comment;
        hook.result.full = hook.result.comment;
        hook.result.isTruncated = false;
        if (hook.result.comment.length > 120) {
          hook.result.truncated =
            `${hook.result.comment.substr(0, 120)} ...[more]`;
          hook.result.full = hook.result.comment;
          hook.result.isTruncated = true;
        }
      }
    }
  };
}
