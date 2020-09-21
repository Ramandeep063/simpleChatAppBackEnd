const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors({
  'Access-Control-Allow-Origin': '*'
}));

io.on('connection', (socket) => {
  console.log('connection established with user!');

  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, ...user } = addUser({ id: socket.id, name, room });
    console.log(user);
    if (error) { return callback(error) };
    if (typeof user !== 'undefined') {
      socket.emit('message', { user: 'admin', text: `${user.name} welcome to ${user.room}` });

      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });

      socket.join(user.room);
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    }
    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    if (typeof user !== 'undefined') {
      io.to(user.room).emit('message', { user: user.name, text: message });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    }
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (typeof user !== 'undefined') {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left!` });
    }
  });

});

server.listen(PORT, () => console.log('server started'));