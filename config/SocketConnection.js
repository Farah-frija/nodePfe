const WebSocket = require('ws');

// Map to store WebSocket connections by user ID
const userSockets = new Map();

// WebSocket server setup
const setupWebSocketServer = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        // Extract user ID from request headers
        const userId = req.headers['user-id'];
        
        // Store WebSocket connection associated with user ID
        if (userId) {
            userSockets.set(userId, ws);
        }

        ws.on('close', () => {
            // Remove WebSocket connection when closed
            userSockets.delete(userId);
        });
    });
};

// Function to send notification to a specific user
const sendNotificationToUser = (userId, message) => {
    const ws = userSockets.get(userId);
    console.log(userId);
    console.log(ws);
    console.log(message);
    if (ws) {
        ws.send(JSON.stringify(message));
    }
};


module.exports = { setupWebSocketServer, sendNotificationToUser };
