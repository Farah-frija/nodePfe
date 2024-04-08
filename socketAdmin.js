const io = require('socket.io-client');

// Connect to the server
const socket = io('http://localhost:8000');
socket.on('connect', () => {
    console.log('Connected to socket.io server admin');
});
// Task data
const taskData = {
    "instructions": "Some instructions here...",
    "description": "Description...",
    "titre": "Task1000",
    "createurDeContenu": "65fc0ad49635019959a580e7",
    "etat": "en attente",
    "dateLimite": "2024-04-07T00:00:00.000Z",
    "optionnel": false,
    "vuPar": [],
    // Other fields...
};

// Emit the task data as an 'optional task'
socket.emit('mandatory task', { userId: '65fc0ad49635019959a580e6', task: taskData });
