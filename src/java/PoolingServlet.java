/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;
import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.User;
import twitter4j.conf.ConfigurationBuilder;

/**
 *
 * @author Ilyas
 */
@WebServlet(urlPatterns = {"/TwitterStream"})
public class PoolingServlet extends WebSocketServlet {

    private static final long serialVersionUID = 1L;
    private TwitterHelper twitterHelper;
    public static ArrayList<MyMessageInbound> mmiList = new ArrayList<MyMessageInbound>();

    @Override
    public void init() throws ServletException {
        super.init();
        twitterHelper = new TwitterHelper();
    }

    @Override
    public void destroy() {
        super.destroy();
        twitterHelper.shutdown();
    }

    @Override
    protected StreamInbound createWebSocketInbound(String string, HttpServletRequest hsr) {
        return new MyMessageInbound();
    }

    public class MyMessageInbound extends MessageInbound {

        WsOutbound myoutbound;

        @Override
        public void onOpen(WsOutbound outbound) {
            try {
                System.out.println("Open Client.");
                this.myoutbound = outbound;
                mmiList.add(this);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onClose(int status) {
            System.out.println("Close Client.");
            mmiList.remove(this);
        }

        @Override
        public void onTextMessage(CharBuffer cb) throws IOException {
            System.out.println("Accept Message : " + cb);
            for (MyMessageInbound mmib : mmiList) {
                CharBuffer buffer = CharBuffer.wrap(cb);
                mmib.myoutbound.writeTextMessage(buffer);
                mmib.myoutbound.flush();
            }
        }

        @Override
        public void onBinaryMessage(ByteBuffer bb) throws IOException {
        }
    }

}
