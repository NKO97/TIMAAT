package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the UserPassword database table.
 * 
 */
@Entity
@NamedQuery(name="UserPassword.findAll", query="SELECT u FROM UserPassword u")
public class UserPassword implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private int keyStretchingIterations;

	private String salt;

	private String stretchedHashEncrypted;

	//bi-directional many-to-one association to UserAccount
	@JsonIgnore
	@OneToMany(mappedBy="userPassword")
	private List<UserAccount> userAccounts;

	//bi-directional many-to-one association to UserPasswordHashType
	@ManyToOne
	@JoinColumn(name="UserPasswordHashTypeID")
	private UserPasswordHashType userPasswordHashType;

	//bi-directional many-to-one association to UserPasswordOldHashes
	@OneToMany(mappedBy="userPassword")
	private List<UserPasswordOldHashes> userPasswordOldHashes;

	public UserPassword() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getKeyStretchingIterations() {
		return this.keyStretchingIterations;
	}

	public void setKeyStretchingIterations(int keyStretchingIterations) {
		this.keyStretchingIterations = keyStretchingIterations;
	}

	public String getSalt() {
		return this.salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getStretchedHashEncrypted() {
		return this.stretchedHashEncrypted;
	}

	public void setStretchedHashEncrypted(String stretchedHashEncrypted) {
		this.stretchedHashEncrypted = stretchedHashEncrypted;
	}

	public List<UserAccount> getUserAccounts() {
		return this.userAccounts;
	}

	public void setUserAccounts(List<UserAccount> userAccounts) {
		this.userAccounts = userAccounts;
	}

	public UserAccount addUserAccount(UserAccount userAccount) {
		getUserAccounts().add(userAccount);
		userAccount.setUserPassword(this);

		return userAccount;
	}

	public UserAccount removeUserAccount(UserAccount userAccount) {
		getUserAccounts().remove(userAccount);
		userAccount.setUserPassword(null);

		return userAccount;
	}

	public UserPasswordHashType getUserPasswordHashType() {
		return this.userPasswordHashType;
	}

	public void setUserPasswordHashType(UserPasswordHashType userPasswordHashType) {
		this.userPasswordHashType = userPasswordHashType;
	}

	public List<UserPasswordOldHashes> getUserPasswordOldHashes() {
		return this.userPasswordOldHashes;
	}

	public void setUserPasswordOldHashes(List<UserPasswordOldHashes> userPasswordOldHashes) {
		this.userPasswordOldHashes = userPasswordOldHashes;
	}

	public UserPasswordOldHashes addUserPasswordOldHashe(UserPasswordOldHashes userPasswordOldHashe) {
		getUserPasswordOldHashes().add(userPasswordOldHashe);
		userPasswordOldHashe.setUserPassword(this);

		return userPasswordOldHashe;
	}

	public UserPasswordOldHashes removeUserPasswordOldHashe(UserPasswordOldHashes userPasswordOldHashe) {
		getUserPasswordOldHashes().remove(userPasswordOldHashe);
		userPasswordOldHashe.setUserPassword(null);

		return userPasswordOldHashe;
	}

}