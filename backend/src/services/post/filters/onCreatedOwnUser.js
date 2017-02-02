export default function () {
  return function onCreatedOwnUser(data, connection) {
    if (data.userId !== connection.user.id.toString()) {
      return false;
    }
    return data;
  };
}
