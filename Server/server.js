const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();

const clientPath = `${__dirname}/../Client`;
console.log(`Serving Static from ${clientPath}`);
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

io.on('connection', (sock) => {
    console.log("Someone Connected");
    sock.emit('message', 'Hi, you are now connected');
    
    sock.on('message', (text) => {
        io.emit('message', text);
    });
})

server.on('error', (err) => {
    console.error('Server Error:', err);
});

server.listen(8080, () => {
    console.log('Virtual Baseball Server Started on 8080');
});