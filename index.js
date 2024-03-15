const express = require('express')// like the import 
const connectToDB = require("./config/db");
const logger = require("./middleware/logger");
const { notFound, errorHanlder } = require("./middleware/errors");
require("dotenv").config();
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
// Connection To Database
connectToDB();

// Init App
const app = express();
//const server = http.createServer(app);
//const io = socketIO(server);

// Socket.IO connection handling
/*io.on('connection', (socket) => {
  console.log('A user connected');
  // You can handle socket events or emit messages here
});*/

// Static Folder
app.use(express.static(path.join(__dirname,"images")));

// Apply Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger);

// Helmet
app.use(helmet());

// Cors Policy
app.use(cors())



// Routes

app.use("/api/auth", require("./Sprints/authentification/routes/authRoutes"));
app.use("/api/users", require("./Sprints/authentification/routes/users"));
app.use("/api/password", require("./Sprints/authentification/routes/password"));
app.use("/api/tasks",require("./Sprints/Tasks_management/routes/TaskRoutes"));

// Error Hanlder Middleware
app.use(notFound);
app.use(errorHanlder);

// Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));




























//if the cmd is start then we don't need run else we need it