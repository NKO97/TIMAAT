package de.bitgilde.TIMAAT.notification;

import java.io.Serializable;
import java.sql.Timestamp;

public class NotificationMessage implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public String username;
	public long timestamp;
	public String message;
	public int dataID;
	public Object data;
	
	public NotificationMessage() {
		
	}
	
	public NotificationMessage(String username, String message, int dataID) {
		this(username, message, dataID, null);
	}

	public NotificationMessage(String username, String message, int dataID, Object data) {
		this.username = username;
		this.message = message;
		this.timestamp = new Timestamp(System.currentTimeMillis()).getTime();
		this.dataID = dataID;
		this.data = data;
	}
	
	public String getUsername() {
		return username;
	}
	public NotificationMessage setUsername(String username) {
		this.username = username;
		
		return this;
	}
	
	public String getMessage() {
		return message;
	}
	public NotificationMessage setMessage(String message) {
		this.message = message;
		
		return this;
	}

	public int getDataID() {
		return dataID;
	}
	public NotificationMessage setDataID(int dataID) {
		this.dataID = dataID;
		
		return this;
	}

	public long getTimestamp() {
		return timestamp;
	}
	public NotificationMessage setTimestamp(long timestamp) {
		this.timestamp = timestamp;
		
		return this;
	}

	public Object getData() {
		return data;
	}
	public NotificationMessage setData(Object data) {
		this.data = data;
		
		return this;
	}
	
	

}
