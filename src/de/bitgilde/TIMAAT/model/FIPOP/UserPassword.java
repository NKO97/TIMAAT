package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the user_password database table.
 *
 */
@Entity
@Table(name="user_password")
@NamedQuery(name="UserPassword.findAll", query="SELECT up FROM UserPassword up")
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

}