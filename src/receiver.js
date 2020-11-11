'use strict';

const net = require('net');

let i = 0;
let start = null;

const server = net.createServer();

server.listen(6514, '0.0.0.0', () => {
  console.log('listening');
  server.on('connection', socket => {
    const socketid = i++;
    let receivedData = false;
    let receivedBytes = 0;
    if (start === null) start = Date.now();
    console.time(`connection${socketid}`);
    console.log(`NEW CONNECTION ${socketid}`);
    socket.on('error', err => console.log(`ERROR ${socketid} - ${err}`));
    socket.on('end', () => console.log(`END ${socketid}`));
    socket.on('close', hadError => {
      console.timeEnd(`connection${socketid}`);
      const elapsed = (Date.now() - start);
      console.log(`CLOSE ${socketid} - ${hadError} - \
RECEIVED: ${receivedBytes} - ELAPSED: ${elapsed}ms`);
    });
    socket.on('data', data => {
      receivedBytes += data.length;
      if (!receivedData) {
        console.log(`RECEIVED DATA - ${socketid}`);
        receivedData = true;
      }
    });
  });
});
