package de.bitgilde.TIMAAT.notification;

import jakarta.websocket.Session;

public class UserSubscriptions {
	
	String username;
	Session session;
	int analysisList;
	
	public UserSubscriptions(String username, Session session) {
		this.username = username;
		this.session = session;
	}
	
	public String getUsername() {
		return username;
	}
	public UserSubscriptions setUsername(String username) {
		this.username = username;
		
		return this;
	}
	
	public Session getSession() {
		return session;
	}
	public UserSubscriptions setSession(Session session) {
		this.session = session;
		return this;
	}
	
	public int getAnalysisList() {
		return analysisList;
	}
	public UserSubscriptions setAnalysisList(int analysisList) {
		this.analysisList = analysisList;
		
		return this;
	}
	
	
}
