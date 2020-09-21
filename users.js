const users = [];

const addUser = ({ id, name, room }) => {
  const existingUsers = users.find(item => item.name === name && item.room === room);

  if (typeof existingUsers !== 'undefined') {
    return { error: 'username is existed' };
  }
  let user = { id, name, room };
  console.log('users files');
  console.log(user);
  users.push(user);
  return user;
}

const removeUser = (id) => {
  let index = users.findIndex(item => item.id === id);

  if (index >= 0) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find(item => item.id === id);

const getUsersInRoom = (room) => users.filter(item => item.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom, };