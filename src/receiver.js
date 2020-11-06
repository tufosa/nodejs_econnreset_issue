'use strict';

const net = require('net');

let i = 0;

const server = net.createServer();

server.listen(6514, '0.0.0.0', () => {
  console.log('listening');
  server.on('connection', socket => {
    const socketid = i++;
    let receivedData = false;
    console.log(`NEW CONNECTION ${socketid}`);
    socket.on('error', err => console.log(`ERROR ${socketid} - ${err}`));
    socket.on('end', () => console.log(`END ${socketid}`));
    socket.on('close', hadError => console.log(`CLOSE ${socketid} - \
${hadError}`));
    socket.on('data', () => {
      if (!receivedData) {
        console.log(`RECEIVED DATA - ${socketid}`);
        receivedData = true;
      }
    });
  });
});
