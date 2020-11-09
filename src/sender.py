
import socket

mysocket = None
msg = "Lorem ipsum dolor sit amet, consectetur adipiscing elit." * 10

def connect():
  global mysocket
  mysocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
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
      connect()

def main():
  connect()
  send()
  close()

main()
