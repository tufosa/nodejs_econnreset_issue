'use strict';

const fs = require('fs');
const path = require('path');
const tls = require('tls');
let socket;
const msg = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  .repeat(10);
const key = fs.readFileSync(path.join(__dirname, `./certs/client1.key`));
const cert = fs.readFileSync(path.join(__dirname, `./certs/client1.crt`));
const checkServerIdentity = () => undefined;

function connectSSL() {
  return new Promise(ok => {
    socket = tls.connect(6514, {key, cert, checkServerIdentity}, () => ok());
  });
}

async function close() {
  return new Promise (ok => {
    //socket.end(() => destroy(ok));
    destroy(ok);
  });
}

function destroy(cb) {
  socket.destroy();
  socket = null;
  cb();
}

function sendOne() {
  return new Promise(ok => socket.write(msg, ok));
}

async function send() {
  for (let i=1; i<1000001; i++) {
    await sendOne();
    if (i%100000 === 0) {
      await close();
      await connectSSL();
    }
  }
}

async function main() {
  await connectSSL();
  await send();
  await close();
}

main().then(() => {
  console.log('Process finished');
  process.exit(0);
});
