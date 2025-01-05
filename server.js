const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('A user connected...');
    
    // Emit the 'message' event to all clients
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    });
    
    // Handle typing status with the user's name
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); // Broadcast typing status and username to others
    });
    
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});
