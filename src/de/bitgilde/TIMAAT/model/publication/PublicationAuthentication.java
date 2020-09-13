package de.bitgilde.TIMAAT.model.publication;

import java.io.Serializable;

/**
*
* @author Jens-Martin Loebel <loebel@bitgilde.de>
*/
public class PublicationAuthentication implements Serializable {

	private static final long serialVersionUID = 1L;
	
	
	private String scheme;
	private String user;
	private String password;
	private String token;
	private String hash;
	
	
	public String getScheme() {
		return scheme;
	}
	public PublicationAuthentication setScheme(String scheme) {
		this.scheme = scheme;
		return this;
	}
	
	public String getUser() {
		return user;
	}
	public PublicationAuthentication setUser(String user) {
		this.user = user;
		return this;
	}
	
	public String getPassword() {
		return password;
	}
	public PublicationAuthentication setPassword(String password) {
		this.password = password;
		return this;
	}
	
	public String getToken() {
		return token;
	}
	public PublicationAuthentication setToken(String token) {
		this.token = token;
		return this;
	}
	
	public String getHash() {
		return hash;
	}
	public PublicationAuthentication setHash(String hash) {
		this.hash = hash;
		return this;
	}

	
}
