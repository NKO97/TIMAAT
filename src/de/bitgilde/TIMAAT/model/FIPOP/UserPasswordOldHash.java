package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the user_password_old_hashes database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="user_password_old_hash")
@NamedQuery(name="UserPasswordOldHash.findAll", query="SELECT upoh FROM UserPasswordOldHash upoh")
public class UserPasswordOldHash implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="key_stretching_iterations")
	private int keyStretchingIterations;

	private String salt;

	@Column(name="stretched_hash_encrypted")
	private String stretchedHashEncrypted;

	//bi-directional many-to-one association to UserPassword
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="user_account_id")
	private UserAccount userAccount;

	//bi-directional many-to-one association to UserPasswordHashType
	@ManyToOne
	@JoinColumn(name="user_password_hash_type_id")
	private UserPasswordHashType userPasswordHashType;

	public UserPasswordOldHash() {
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

	public UserAccount getUserAccount() {
		return this.userAccount;
	}

	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
	}

	public UserPasswordHashType getUserPasswordHashType() {
		return this.userPasswordHashType;
	}

	public void setUserPasswordHashType(UserPasswordHashType userPasswordHashType) {
		this.userPasswordHashType = userPasswordHashType;
	}

}