package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;


/**
 * The persistent class for the user_log database table.
 * 
 */
@Entity
@Table(name="user_log")
@NamedQuery(name="UserLog.findAll", query="SELECT u FROM UserLog u")
public class UserLog implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="date_time")
	private Date dateTime;

	//bi-directional many-to-one association to UserAccount
	@ManyToOne
	@JoinColumn(name="user_account_id")
	private UserAccount userAccount;

	//bi-directional many-to-one association to UserLogEventType
	@ManyToOne
	@JoinColumn(name="user_log_event_type_id")
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