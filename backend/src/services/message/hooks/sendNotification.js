export default function () {
  return function sendNotification(hook) {
    const { groupId, content, createdBy } = hook.result;

    let type = 'directMessage';
    let message = createdBy.name ? createdBy.name : createdBy.username;

    // If group type is not hidden, lets add on the group name to the notification message
    hook.app.service('groups').get(groupId)
     .then(groupDetails => {
       if (!groupDetails.hidden) {
         message += ` @ ${groupDetails.name}`;
         type = 'groupMessage';
       }
     })
     .then(() => (
       hook.app.service('groupUsers').find({
         query: { groupId, isActive: false },
         paginate: false,
       })
     ))
     .then(groupMembers => {
       message += `: ${content}`;
       groupMembers.data.forEach((memberDetails) => (
         hook.app.service('notifications').create({
           data: {
             message,
             type,
           },
           userId: memberDetails.userId,
         })
       ));
     });
    return hook;
  };
}
