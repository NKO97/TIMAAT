package de.bitgilde.TIMAAT.notification;

import java.io.Serializable;

/**
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 */
public class NotificationRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	public String token;
	public String request;
	public int dataID;


	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}

	public String getRequest() {
		return request;
	}
	public void setRequest(String request) {
		this.request = request;
	}

	public int getDataID() {
		return dataID;
	}
	public void setDataID(int dataID) {
		this.dataID = dataID;
	}



}
