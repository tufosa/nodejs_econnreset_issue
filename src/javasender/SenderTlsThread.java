package javasender;

import java.io.*;
import javax.net.ssl.*;

public class SenderTlsThread extends Thread {
  public static final String MSG = new String(new char[10])
    .replace("\0","Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  protected SSLSocketFactory factory;
  protected ThreadListener listener;
  protected SSLSocket socket;
  protected PrintWriter writer;

  public SenderTlsThread(SSLSocketFactory factory, ThreadListener listener) {
    super();
    this.factory = factory;
    this.listener = listener;
  }

  protected void connect() throws IOException {
    socket = (SSLSocket)factory.createSocket("127.0.0.1", 6514);
    socket.startHandshake();
    writer = new PrintWriter(new BufferedWriter(new OutputStreamWriter(
      socket.getOutputStream())));
  }

  protected void send() throws IOException {
    for (int i=1; i<100001; i++) writer.print(MSG);
    writer.flush();
  }

  protected void close() throws IOException {
    writer.close();
    socket.close();
  }

  public void run() {
    try {
      connect();
      send();
      listener.notifyListener(this);
    } catch(IOException e) {}
  }
}
