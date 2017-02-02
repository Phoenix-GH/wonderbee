import moment from 'moment';

export default function () {
  return function createUpdatedString(hook) {
    if (hook.params.provider) {
      hook.result.data.forEach((group, i) => {
        let updatedAt = moment(group.lastMessageTime).format('L');
        if (moment(group.lastMessageTime).isSame(moment(), 'day')) {
          updatedAt = moment(group.lastMessageTime).from(moment());
        } else if (moment(group.lastMessageTime).isSame(moment(), 'week')) {
          updatedAt = moment(group.lastMessageTime).format('dddd');
        }
        hook.result.data[i].updateAtString = updatedAt;
      });
    }
    return hook;
  };
}
