package de.bitgilde.TIMAAT.model.publication;

import java.io.Serializable;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

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
