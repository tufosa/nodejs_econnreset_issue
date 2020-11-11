'use strict';

const tls = require('tls');
const fs = require('fs');
const path = require('path');

let i = 0;
let start = null;

const server = tls.createServer({
  key: fs.readFileSync(path.join(__dirname, `./certs/collector.key`)),
  passphrase: 'uni1',
  cert: fs.readFileSync(path.join(__dirname, `./certs/collector.crt`)),
  ca: fs.readFileSync(path.join(__dirname, `./certs/userCA.crt`)) +
    fs.readFileSync(path.join(__dirname, `./certs/rootCA.crt`)),
  requestCert: true,
  rejectUnauthorized: true
});

server.listen(6514, '0.0.0.0', () => {
  console.log('listening');
  server.on('secureConnection', socket => {
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
