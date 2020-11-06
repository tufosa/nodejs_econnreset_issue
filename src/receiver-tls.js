'use strict';

const tls = require('tls');
const fs = require('fs');
const path = require('path');

let i = 0;

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
