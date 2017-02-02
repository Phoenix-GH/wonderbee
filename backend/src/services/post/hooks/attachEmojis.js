export default function () {
  return function attachEmojis(hook) {
    if (hook.params.provider) {
      const promises = hook.result.data.map((result, i) => {
        const emojiService = hook.app.service('emojis');
        const query = {
          id: { $in: result.emojiIds },
        };
        return emojiService.find({ query })
        .then(emj => (hook.result.data[i].emojis = emj));
      });
      return Promise.all(promises)
      .then(() => hook)
      .catch(error => console.log(error));
    }
    return hook;
  };
}
