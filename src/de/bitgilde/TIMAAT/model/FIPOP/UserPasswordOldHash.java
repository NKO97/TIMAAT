package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the user_password_old_hashes database table.
 * 
 */
@Entity
@Table(name="user_password_old_hash")
@NamedQuery(name="UserPasswordOldHash.findAll", query="SELECT u FROM UserPasswordOldHash u")
public class UserPasswordOldHash implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	@Column(name="key_stretching_iterations")
	private int keyStretchingIterations;

	private String salt;

	@Column(name="stretched_hash_encrypted")
	private String stretchedHashEncrypted;

	//bi-directional many-to-one association to UserPassword
	@ManyToOne
	@JoinColumn(name="user_password_id")
	private UserPassword userPassword;

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

	public UserPassword getUserPassword() {
		return this.userPassword;
	}

	public void setUserPassword(UserPassword userPassword) {
		this.userPassword = userPassword;
	}

}