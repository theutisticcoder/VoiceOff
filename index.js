const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
var users = [];
// Serve static files
app.use(express.static(__dirname));
// Handle client connections
io.on('connection', (socket) => {
    socket.on("joined", (n)=> {
        users.push({name: n[0], stage: 0, id: socket.id, content: [], room: n[1]});
        socket.join(n[1]);
    })
});
// Start the server
const PORT = 3000;
server.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});