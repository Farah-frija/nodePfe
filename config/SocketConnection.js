const socketIO = require('socket.io');
const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('A user connected');
  });