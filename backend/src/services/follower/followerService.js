import { ServiceCountSum } from '../../custom-services';
import Sequelize from 'sequelize';

export default class FollowerService extends ServiceCountSum {
  findMutual(user, currentUser) {
    return this.count({
      $or: [
        {
          userId: user,
          followUserId: currentUser,
        }, {
          userId: currentUser,
          followUserId: user,
        },
      ],
    })
    .then(count => {
      if (count !== 2) {
        return [];
      }
      return this.Model.findAll({
        where: {
          followUserId: user,
          $and: [
            { userId: { $ne: currentUser } },
            {
              userId: {
                $in: Sequelize.literal(`(SELECT  "followUserId" FROM followers
                                         WHERE "userId"=${user})`),
              },
            },
            {
              userId: {
                $notIn: Sequelize.literal(`(SELECT  "followUserId" FROM followers
                                            WHERE "userId"=${currentUser})`),
              },
            },
          ],
        },
      });
    });
  }
}
