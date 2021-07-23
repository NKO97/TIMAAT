package de.bitgilde.TIMAAT.rest;

import java.io.Serializable;

public class UserCredentials implements Serializable {

	private static final long serialVersionUID = 1L;

	private String username;
	private String password;
	private String newPassword;

	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getNewPassword() {
		return newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

}
