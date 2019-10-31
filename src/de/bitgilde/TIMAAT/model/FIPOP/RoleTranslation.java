package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the role_translation database table.
 * 
 */
@Entity
@Table(name="role_translation")
@NamedQuery(name="RoleTranslation.findAll", query="SELECT r FROM RoleTranslation r")
public class RoleTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-RoleTranslation")
	private Language language;

	//bi-directional many-to-one association to Role
	@ManyToOne
	@JsonBackReference(value = "Role-RoleTranslation")
	private Role role;

	public RoleTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Role getRole() {
		return this.role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

}