export default function () {
  return function findVotesByImageId(hook) {
    const sequelize = hook.app.get('sequelize');
    return sequelize.query(
      'SELECT "position", COUNT(*) AS "votes" FROM "heatmapVotes" WHERE "imageId" = ? GROUP BY "position"',
      {
        type: sequelize.QueryTypes.SELECT,
        replacements: [hook.id],
      },
    ).then(votes => {
      hook.result = {
        votes,
        totalVotes: votes.reduce((sum, { votes }) => sum + Number(votes), 0),
      };
      return hook;
    });
  };
}
