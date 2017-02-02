export default function () {
  return function attachImages(hook) {
    if (hook.params.provider && hook.result.data.length > 0) {
      const imageService = hook.app.service('images');
      const promises = hook.result.data.map((post, i) =>
        imageService.find({ ...hook.params, query: { postId: post.id } })
        .then((images) => {
          hook.result.data[i].preview = images.filter(img => (img.order === 0))[0];
          const imagesWithoutPreview = images.filter(img => (img.order !== 0));
          hook.result.data[i].images = images.length > 1 ? imagesWithoutPreview : images;
          hook.result.data[i].heatmap = post.voting && images.length === 1;
          hook.result.data[i].hasLocation = images.filter(img => img.locationId).length > 0;
          hook.result.data[i].hasPins = images.filter(img => img.imageTags.length > 0).length > 0;
          hook.result.data[i].votedImage = images.filter(img => img.voted).length > 0;
          const totalVotes = images.map(img => img.votes).reduce((prev, curr) => prev + curr, 0);
          hook.result.data[i].votesImage = totalVotes;
          hook.result.data[i].imageVoteDetails = [];
          const highestVotes = {
            votes: 0,
            imageOrder: -1,
          };
          if (hook.result.data[i].voting && imagesWithoutPreview.length > 1) {
            imagesWithoutPreview.forEach((img, j) => {
              if (img.votes > highestVotes.votes) {
                highestVotes.votes = img.votes;
                highestVotes.imageOrder = j;
              }
              hook.result.data[i].imageVoteDetails.push({
                order: img.order,
                votes: img.votes,
                percentage: img.votes / totalVotes,
                voted: img.voted,
                highest: false,
              });
            });
            if (highestVotes.imageOrder >= 0) {
              hook.result.data[i].imageVoteDetails[highestVotes.imageOrder].highest = true;
            }
          }
          return hook;
        })
        .catch(error => console.log(error))
      );
      return Promise.all(promises)
      .then(() => hook);
    }
    return hook;
  };
}
