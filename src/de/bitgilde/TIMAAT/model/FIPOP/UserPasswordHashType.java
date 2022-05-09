package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;


/**
 * The persistent class for the user_password_hash_type database table.
 *
 */
@Entity
@Table(name="user_password_hash_type")
@NamedQuery(name="UserPasswordHashType.findAll", query="SELECT upht FROM UserPasswordHashType upht")
public class UserPasswordHashType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to UserPassword
	@JsonIgnore
	@OneToMany(mappedBy="userPasswordHashType")
	private List<UserPassword> userPasswords;

	public UserPasswordHashType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public List<UserPassword> getUserPasswords() {
		return this.userPasswords;
	}

	public void setUserPasswords(List<UserPassword> userPasswords) {
		this.userPasswords = userPasswords;
	}

	public UserPassword addUserPassword(UserPassword userPassword) {
		getUserPasswords().add(userPassword);
		userPassword.setUserPasswordHashType(this);

		return userPassword;
	}

	public UserPassword removeUserPassword(UserPassword userPassword) {
		getUserPasswords().remove(userPassword);
		userPassword.setUserPasswordHashType(null);

		return userPassword;
	}

}