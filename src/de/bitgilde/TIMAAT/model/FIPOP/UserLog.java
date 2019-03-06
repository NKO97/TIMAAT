package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the UserLog database table.
 * 
 */
@Entity
@NamedQuery(name="UserLog.findAll", query="SELECT u FROM UserLog u")
public class UserLog implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Temporal(TemporalType.TIMESTAMP)
	private Date dateTime;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="UserAccountID")
	private UserAccount userAccount;

	//bi-directional many-to-one association to UserLogEventType
	@ManyToOne
	@JoinColumn(name="UserLogEventTypeID")
	private UserLogEventType userLogEventType;

	public UserLog() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Date getDateTime() {
		return this.dateTime;
	}

	public void setDateTime(Date dateTime) {
		this.dateTime = dateTime;
	}

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

	public UserLogEventType getUserLogEventType() {
		return this.userLogEventType;
	}

	public void setUserLogEventType(UserLogEventType userLogEventType) {
		this.userLogEventType = userLogEventType;
	}

}