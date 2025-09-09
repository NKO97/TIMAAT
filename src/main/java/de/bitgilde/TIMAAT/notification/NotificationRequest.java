package de.bitgilde.TIMAAT.notification;

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
