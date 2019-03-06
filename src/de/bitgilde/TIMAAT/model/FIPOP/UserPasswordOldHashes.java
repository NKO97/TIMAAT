package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the UserPasswordOldHashes database table.
 * 
 */
@Entity
@Table(name="UserPasswordOldHashes")
@NamedQuery(name="UserPasswordOldHashes.findAll", query="SELECT u FROM UserPasswordOldHashes u")
public class UserPasswordOldHashes implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private int keyStretchingIterations;

	private String salt;

	private String stretchedHashEncrypted;

	//bi-directional many-to-one association to UserPassword
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="UserPasswordID")
	private UserPassword userPassword;

	public UserPasswordOldHashes() {
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