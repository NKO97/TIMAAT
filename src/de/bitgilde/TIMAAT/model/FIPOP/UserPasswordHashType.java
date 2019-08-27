package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the UserPasswordHashType database table.
 * 
 */
@Entity
@NamedQuery(name="UserPasswordHashType.findAll", query="SELECT u FROM UserPasswordHashType u")
@Table(name="user_password_hash_type")
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