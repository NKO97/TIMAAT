package de.bitgilde.TIMAAT.notification;

import java.security.Key;
import java.util.HashMap;
import java.util.Map;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

import de.bitgilde.TIMAAT.security.TIMAATKeyGenerator;
import io.jsonwebtoken.Jwts;

@ServerEndpoint("/api/notification")
public class NotificationWebSocket {
	
    private static Map<String, UserSubscriptions> userSessions = new HashMap<String, UserSubscriptions>();

	@OnOpen
    public void onOpen(Session session) {
        System.out.println("TIMAAT::Notification:new session " + session.getId()+" - "+session.getMaxIdleTimeout());
	}
	
    @OnClose
    public void onClose(Session session) {
        System.out.println("TIMAAT::Notification:end session " +  session.getId());
        endUserSession(session);
    }
    
    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("onMessage::From=" + session.getId() + " Message=" + message);
        
        try {
        	NotificationRequest req = new ObjectMapper().readValue(message, NotificationRequest.class);
        	String username = validateRequestToken(req.getToken());
        	
        	if ( req.getRequest() == null || !req.getRequest().equalsIgnoreCase("subscribe-list") ) return;
        	
        	if ( username != null ) {
        		// TODO check if user account status has expired or is blocked
        		if ( !userSessions.containsKey(session.getId()) ) createUserSession(username, session);
        		notifyUserSubscription(username, req.dataID, session);
        	}
        } catch (Exception e) {
        	System.out.println("TIMAAT::Notification:client message failed to decode");
        }
    }
    
    private void notifyUserSubscription(String username, int listID, Session session) {
    	UserSubscriptions userSub = userSessions.get(session.getId());
    	if ( userSub == null ) return;
    	int oldListID = userSub.getAnalysisList();
    	if ( oldListID > 0 ) notifyUserUnsubscribe(username, oldListID);
		userSub.setAnalysisList(listID);
		if ( listID > 0 ) {
	    	for (UserSubscriptions sub : userSessions.values()) {
	    		if ( !sub.getUsername().equalsIgnoreCase(username) && sub.getAnalysisList() == listID )
	    			sendNotificationTo(sub.session, username, "subscribe-list", listID);
	    	}
		}
	}
    
    public static void notifyUserAction(String username, String action, int listID, Object data) {
    	if ( username == null || action == null ) return;
    	for (UserSubscriptions userSub : userSessions.values()) {
    		if ( !userSub.getUsername().equalsIgnoreCase(username) && userSub.getAnalysisList() == listID )
    			sendNotificationTo(userSub.session, username, action, listID, data);
    	}
    }
    
    private void notifyUserUnsubscribe(String username, int listID) {
    	if ( listID <= 0 ) return;
    	for (UserSubscriptions userSub : userSessions.values()) {
    		if ( !userSub.getUsername().equalsIgnoreCase(username) && userSub.getAnalysisList() == listID )
    			sendNotificationTo(userSub.session, username, "unsubscribe-list", listID);
    	}
    }
    
    private static void sendNotificationTo(Session session, String username, String message, int dataID) {
    	sendNotificationTo(session, username, message, dataID, null);
    }
    private static void sendNotificationTo(Session session, String username, String message, int dataID, Object data) {
    	try {
    		NotificationMessage notification = new NotificationMessage(username, message, dataID);
    		if ( data != null ) notification.setData(data);
    		ObjectWriter ow = new ObjectMapper().writer();
        	session.getAsyncRemote().sendText(ow.writeValueAsString(notification));
    	} catch (Exception e) {
    		// TODO remove session
    	}
    }
    
    private void endUserSession(Session session) {
    	UserSubscriptions userSub = userSessions.get(session.getId());
    	if ( userSub == null ) return;
    	if ( userSub.getAnalysisList() > 0 ) notifyUserUnsubscribe(userSub.getUsername(), userSub.getAnalysisList());
    	try {
    		if ( session.isOpen() ) session.close();
    		userSessions.remove(session.getId());
    	} catch (Exception e) {
    		userSessions.remove(session.getId());
    	}
    }
    
    
	private void createUserSession(String username, Session session) {
    	userSessions.put(session.getId(), new UserSubscriptions(username, session));
    }
    
    @OnError
    public void onError(Throwable t) {
    	// ignore
    }
    
    private String validateRequestToken(String token) {
    	String username = null;
    	
    	try {
    		Key key = TIMAATKeyGenerator.generateKey();
    		username = Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody().getSubject();
    	} catch (Exception e) {
    		return null;
    	}
		
		return username;

    }
}
