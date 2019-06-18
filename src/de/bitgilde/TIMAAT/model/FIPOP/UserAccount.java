package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import java.util.Date;
import java.util.List;



/**
 * The persistent class for the UserAccount database table.
 * 
 */
@Entity(name="UserAccount")
@NamedQuery(name="UserAccount.findAll", query="SELECT u FROM UserAccount u")
public class UserAccount implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String accountName;

	private String contentAccessRights;

	@Temporal(TemporalType.DATE)
	private Date createdAt;

	private String recoveryEmailEncrypted;

	private String userSettingsWebInterface;

	@Enumerated(EnumType.STRING)
	private UserAccountStatus userAccountStatus;

	//bi-directional many-to-one association to UserPassword
	@JsonIgnore
	@XmlTransient
	@ManyToOne
	@JoinColumn(name="UserPasswordID")
	private UserPassword userPassword;

	//bi-directional many-to-one association to UserLog
	@JsonIgnore
	@XmlTransient
	@OneToMany(mappedBy="userAccount")
	private List<UserLog> userLogs;

	public UserAccount() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAccountName() {
		return this.accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getContentAccessRights() {
		return this.contentAccessRights;
	}

	public void setContentAccessRights(String contentAccessRights) {
		this.contentAccessRights = contentAccessRights;
	}

	public Date getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public String getRecoveryEmailEncrypted() {
		return this.recoveryEmailEncrypted;
	}

	public void setRecoveryEmailEncrypted(String recoveryEmailEncrypted) {
		this.recoveryEmailEncrypted = recoveryEmailEncrypted;
	}

	public String getUserSettingsWebInterface() {
		return this.userSettingsWebInterface;
	}

	public void setUserSettingsWebInterface(String userSettingsWebInterface) {
		this.userSettingsWebInterface = userSettingsWebInterface;
	}

	public UserAccountStatus getUserAccountStatus() {
		return this.userAccountStatus;
	}

	public void setUserAccountStatus(UserAccountStatus userAccountStatus) {
		this.userAccountStatus = userAccountStatus;
	}

	@JsonIgnore
	public UserPassword getUserPassword() {
		return this.userPassword;
	}

	public void setUserPassword(UserPassword userPassword) {
		this.userPassword = userPassword;
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
		userLog.setUserAccount(this);

		return userLog;
	}

	public UserLog removeUserLog(UserLog userLog) {
		getUserLogs().remove(userLog);
		userLog.setUserAccount(null);

		return userLog;
	}

}