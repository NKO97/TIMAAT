package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Date;
import java.util.List;



/**
 * The persistent class for the UserAccount database table.
 * 
 */
@Entity(name="UserAccount")
@Table(name="user_account")
@NamedQuery(name="UserAccount.findAll", query="SELECT u FROM UserAccount u")
public class UserAccount implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="account_name")
	private String accountName;

	@Column(name="content_access_rights")
	private String contentAccessRights;

	@Temporal(TemporalType.DATE)
	@Column(name="created_at")
	private Date createdAt;

	@Column(name="display_name")
	private String displayName;

	@Column(name="recovery_email_encrypted")
	private String recoveryEmailEncrypted;

	@Column(name="user_settings_web_interface")
	private String userSettingsWebInterface;

	@Enumerated(EnumType.STRING)
	@Column(name="user_account_status")
	private UserAccountStatus userAccountStatus;

	//bi-directional many-to-one association to UserPassword
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="user_password_id")
	private UserPassword userPassword;

	//bi-directional many-to-one association to UserLog
	@JsonIgnore
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

	public String getDisplayName() {
		return this.displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
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