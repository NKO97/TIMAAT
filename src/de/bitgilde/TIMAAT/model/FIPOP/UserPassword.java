package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the user_password database table.
 * 
 */
@Entity
@Table(name="user_password")
@NamedQuery(name="UserPassword.findAll", query="SELECT u FROM UserPassword u")
public class UserPassword implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="key_stretching_iterations")
	private int keyStretchingIterations;

	private String salt;

	@Column(name="stretched_hash_encrypted")
	private String stretchedHashEncrypted;

	//bi-directional many-to-one association to UserAccount
	@JsonIgnore
	@OneToMany(mappedBy="userPassword")
	private List<UserAccount> userAccounts;

	//bi-directional many-to-one association to UserPasswordHashType
	@ManyToOne
	@JoinColumn(name="user_password_hash_type_id")
	private UserPasswordHashType userPasswordHashType;

	//bi-directional many-to-one association to UserPasswordOldHashe
	@OneToMany(mappedBy="userPassword")
	private List<UserPasswordOldHash> UserPasswordOldHash;

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

	public List<UserPasswordOldHash> getUserPasswordOldHash() {
		return this.UserPasswordOldHash;
	}

	public void setUserPasswordOldHash(List<UserPasswordOldHash> UserPasswordOldHash) {
		this.UserPasswordOldHash = UserPasswordOldHash;
	}

	public UserPasswordOldHash addUserPasswordOldHashe(UserPasswordOldHash UserPasswordOldHash) {
		getUserPasswordOldHash().add(UserPasswordOldHash);
		UserPasswordOldHash.setUserPassword(this);

		return UserPasswordOldHash;
	}

	public UserPasswordOldHash removeUserPasswordOldHashe(UserPasswordOldHash UserPasswordOldHash) {
		getUserPasswordOldHash().remove(UserPasswordOldHash);
		UserPasswordOldHash.setUserPassword(null);

		return UserPasswordOldHash;
	}

}