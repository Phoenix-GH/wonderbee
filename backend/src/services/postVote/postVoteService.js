import { ServiceCountSum } from '../../custom-services';
import Sequelize from 'sequelize';
export class PostVoteService extends ServiceCountSum {
  findMostVotedPost(fromPosts) {
    const query = {
      attributes: ['postId', [Sequelize.fn('COUNT', Sequelize.col('*')), 'votes']],
      group: ['postId'],
      order: [[Sequelize.col('votes'), 'DESC']],
      limit: 1,
    };
    if (fromPosts && fromPosts.length) {
      query.where = { postId: { $in: fromPosts } };
    }
    return this.Model.findOne(query);
  }
}
