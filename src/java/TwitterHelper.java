
import java.io.IOException;
import java.nio.CharBuffer;
import java.util.logging.Level;
import java.util.logging.Logger;
import twitter4j.FilterQuery;
import twitter4j.StallWarning;
import twitter4j.Status;
import twitter4j.StatusDeletionNotice;
import twitter4j.StatusListener;
import twitter4j.TwitterStream;
import twitter4j.TwitterStreamFactory;
import twitter4j.conf.ConfigurationBuilder;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Ilyas
 */
public class TwitterHelper {

    private static final String CONSUMER_KEY = "1refAJQhUbxa94GXwa6B7oMew";
    private static final String CONSUMER_KEY_SECRET = "14cStMXJfxeNBHcL1l0sh6BnAfJiYpqHL3XVinVSUt5cVhZlHV";
    private TwitterStream twitterStream;

    public TwitterHelper() {
        init();
    }

    public void init() {
        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setDebugEnabled(true);

        cb.setOAuthConsumerKey(CONSUMER_KEY);
        cb.setOAuthConsumerSecret(CONSUMER_KEY_SECRET);
        cb.setOAuthAccessToken("K0659012-pSXIblkHxw0WDmpGMdyWA6963M0epXv61ypmTNN6y");
        cb.setOAuthAccessTokenSecret("YI8SFmWE034AnVg36mgcp051Rb2ZnBP7UUYsAXZZPM89e");

        twitterStream = new TwitterStreamFactory(cb.build()).getInstance();

        StatusListener listener = new StatusListener() {

            @Override
            public void onException(Exception arg0) {
            }

            @Override
            public void onDeletionNotice(StatusDeletionNotice arg0) {
            }

            @Override
            public void onScrubGeo(long arg0, long arg1) {
            }

            @Override
            public void onStatus(Status status) {
                if (PoolingServlet.mmiList != null) {
                    for (PoolingServlet.MyMessageInbound mmib : PoolingServlet.mmiList) {
                        try {
                            mmib.myoutbound.writeTextMessage(composeMessage(status));
                            mmib.myoutbound.flush();
                        } catch (IOException ex) {
                            Logger.getLogger(PoolingServlet.class.getName()).log(Level.SEVERE, null, ex);
                        }
                    }
                }

            }

            @Override
            public void onTrackLimitationNotice(int arg0) {
            }

            public void onStallWarning(StallWarning sw) {
            }

        };

        FilterQuery fq = new FilterQuery();
        fq.locations(
                new double[][]{
                    new double[]{-180, -90},
                    new double[]{180, 90}
                });

        twitterStream.addListener(listener);
        twitterStream.filter(fq);

    }

    private CharBuffer composeMessage(Status status) {
        String message = "";
        if (status.getGeoLocation() != null && status.getText() != null) {
            message = status.getGeoLocation().getLatitude()
                    + ":" + status.getGeoLocation().getLongitude()
                    + "=" + status.getText()
                    + ":" + status.getUser().getScreenName();
        } else {
            message = "null";
        }
        return CharBuffer.wrap(message.toCharArray());
    }
    
    public void shutdown(){
        twitterStream.cleanUp();
        twitterStream.shutdown();
    }

}
