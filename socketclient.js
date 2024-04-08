const io = require('socket.io-client');

// Replace 'http://your_socketio_server_address' with the actual address of your socket.io server
const socket = io('http://192.168.1.2:8000');

socket.on('connect', () => {
    console.log('Connected to socket.io server');

    // Assuming userId is known or retrieved somehow
    const userId = '65fc0ad49635019959a580e6';

    // Send a message to join a room
    socket.emit('joinRoom', userId);
    socket.emit('personnalRoom',userId);
});

socket.on('taskMissed', (data) => {
    console.log('Received task missed event:', data);
});
socket.on('newTaskAdded', (data) => {
    console.log('taskadded:', data);
});


socket.on('disconnect', () => {
    console.log('Disconnected from socket.io server');
});
