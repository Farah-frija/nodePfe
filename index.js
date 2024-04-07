const express = require('express')// like the import 
const connectToDB = require("./config/db");
const logger = require("./middleware/logger");
const { notFound, errorHanlder } = require("./middleware/errors");
require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const { setupWebSocketServer } = require('./config/SocketConnection');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socketIo = require('socket.io');
io = socketIo(server);
// Setup WebSocket server
console.log(io);
io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
    
    // When a user connects, join them to their user-specific room
    socket.on('joinRoom', async (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
    });
});
async function checkMissedTasks() {
    const tasks = await Tache.find({ datelimite: { $lt: new Date() }, etat: 'en attente' }).populate('createurDeContenu');
    
    for (const task of tasks) {
        task.etat = 'manqué';
        await task.save();
         
        const message = `Task "${task.title}" deadline missed`;
        for (const user of task.vuPar) {
            io.to(user._id).emit('taskMissed', { taskId: task._id, message });
        }
    }
}

setInterval(checkMissedTasks, 3600000); // Run every minute

// Connection To Database
connectToDB();
// Init App

// Static Folder
app.use(express.static(path.join(__dirname,"images")));

// Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);
app.use(express.static(path.join(__dirname, 'public'))); //***// */

// Helmet
app.use(helmet());

// Cors Policy
app.use(cors())



// Routes
const taskRoutes = require('./Sprints/Tasks_management/routes/TaskRoutes')(io);
app.use("/api/auth", require("./Sprints/authentification/routes/authRoutes"));
app.use("/api/users", require("./Sprints/authentification/routes/users"));
app.use("/api/password", require("./Sprints/authentification/routes/password"));
app.use("/api/tasks",taskRoutes );
app.use("/api/categories",require("./Sprints/Tasks_management/routes/categorieRoute"));
app.use("/api/taskState",require("./Sprints/Tasks_management/routes/TaskStateRoute"));
app.use("/api/Template",require("./Sprints/Tasks_management/routes/templateRoute"));
app.use("/api/project",require("./Sprints/ProjectManagement/routes/ProjectRoute"));
// Error Hanlder Middleware
app.use(notFound);
app.use(errorHanlder);

// Running The Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
module.exports = {io};



























//if the cmd is start then we don't need run else we need it