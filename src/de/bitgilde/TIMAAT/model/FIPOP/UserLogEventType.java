package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the UserLogEventType database table.
 * 
 */
@Entity
@NamedQuery(name="UserLogEventType.findAll", query="SELECT u FROM UserLogEventType u")
public class UserLogEventType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to UserLog
	@JsonIgnore
	@OneToMany(mappedBy="userLogEventType")
	private List<UserLog> userLogs;

	public UserLogEventType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@JsonIgnore
	public List<UserLog> getUserLogs() {
		return this.userLogs;
	}

	public void setUserLogs(List<UserLog> userLogs) {
		this.userLogs = userLogs;
	}

	public UserLog addUserLog(UserLog userLog) {
		getUserLogs().add(userLog);
		userLog.setUserLogEventType(this);

		return userLog;
	}

	public UserLog removeUserLog(UserLog userLog) {
		getUserLogs().remove(userLog);
		userLog.setUserLogEventType(null);

		return userLog;
	}

}