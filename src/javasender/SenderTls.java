package javasender;

import java.io.*;
import javax.net.ssl.*;
import java.security.KeyStore;

public class SenderTls implements ThreadListener {

  public static final int MAX_COUNT = 10;
  protected int count;
  protected SSLSocketFactory factory;

  public SenderTls() throws IOException {
    count = 0;
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

  public void notifyListener(Thread thread) {
    thread.interrupt();
    if (count < MAX_COUNT) launchThread();  
  }

  public void launchThread() {
    SenderTlsThread thread = new SenderTlsThread(factory, this);
    count++;
    thread.start();
  }

  public static void main(String[] args) throws Exception {
    SenderTls sender = new SenderTls();
    sender.launchThread();
  }
}
