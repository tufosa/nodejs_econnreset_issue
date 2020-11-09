
import socket
import ssl
import os

dirname = os.path.dirname(__file__)
key = os.path.join(dirname, './certs/client1.key')
cert = os.path.join(dirname, './certs/client1.crt')
chain = os.path.join(dirname, './certs/chain.crt')
mysocket = None
msg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit." * 10

def connect_ssl():
  global mysocket
  mysocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  context = ssl.create_default_context(cafile=chain)
  context.check_hostname = False
  context.verify_mode = ssl.CERT_NONE
  context.set_ciphers("DEFAULT@SECLEVEL={!s}".format(0))
  context.load_cert_chain(keyfile=key, certfile=cert)
  mysocket = context.wrap_socket(mysocket, server_hostname='127.0.0.1')
  mysocket.connect(('127.0.0.1', 6514));

def close():
  global mysocket
  mysocket.close()
  mysocket = None

def send():
  global mysocket, msg
  for x in range(1, 1000001):
    mysocket.send(msg.encode('utf-8'))
    if x%100000 == 0:
      close()
      connect_ssl()

def main():
  connect_ssl()
  send()
  close()

main()
