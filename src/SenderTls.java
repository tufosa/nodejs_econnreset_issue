import java.net.*;
import java.io.*;
import javax.net.ssl.*;
import java.security.KeyStore;

public class SenderTls {

  public static final String MSG = new String(new char[10])
    .replace("\0","Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
  protected SSLSocketFactory factory;
  protected SSLSocket socket;
  protected PrintWriter writer;

  public SenderTls() throws IOException {
    try {
        SSLContext ctx;
        KeyManagerFactory kmf;
        KeyStore ks;
        char[] passphrase = "client1".toCharArray();

        ctx = SSLContext.getInstance("TLS");
        kmf = KeyManagerFactory.getInstance("SunX509");
        ks = KeyStore.getInstance("JKS");

        ks.load(new FileInputStream("./certs/client1.jks"), passphrase);

        kmf.init(ks, passphrase);
        ctx.init(kmf.getKeyManagers(), null, null);

        factory = ctx.getSocketFactory();
      } catch (Exception e) {
        throw new IOException(e.getMessage());
      }
  }

  public SSLSocketFactory getFactory() { return factory; }

  public void connect() throws IOException {
    socket = (SSLSocket)factory.createSocket("127.0.0.1", 6514);
    socket.startHandshake();
    writer = new PrintWriter(new BufferedWriter(new OutputStreamWriter(
      socket.getOutputStream())));
  }

  public void close() throws IOException {
    writer.close();
    socket.close();
  }

  public void send() throws IOException {
    for (int i=1; i<1000001; i++) {
      writer.print(MSG);
      //writer.flush();
      if (i%100000 == 0) {
        writer.flush();
        close();
        connect();
      }
    }
  }

  public static void main(String[] args) throws Exception {
    try {
      SenderTls sender = new SenderTls();
      sender.connect();
      sender.send();
      sender.close();
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}
