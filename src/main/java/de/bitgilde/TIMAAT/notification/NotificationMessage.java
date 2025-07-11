package de.bitgilde.TIMAAT.notification;

import java.io.Serializable;
import java.sql.Timestamp;

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
