const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const VbGame = require('./vbgame')

const app = express();

const clientPath = `${__dirname}/../Client`;
console.log(`Serving Static from ${clientPath}`);
app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

let waitingPlayer = null;

io.on('connection', (sock) => {
    
    if(waitingPlayer){
        new VbGame(waitingPlayer, sock);
        waitingPlayer=null;
        
    }else{
        waitingPlayer=sock;
        waitingPlayer.emit('message', 'Esperando a un oponente')
    }
    

    
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