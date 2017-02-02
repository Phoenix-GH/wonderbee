export default function () {
  return function filterGroupId(data, connection) {
    if (data.userIds.indexOf(connection.user.id.toString()) > -1) {
      return data;
    }
    return false;
  };
}
