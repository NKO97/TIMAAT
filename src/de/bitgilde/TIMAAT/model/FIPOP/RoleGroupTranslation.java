package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the role_group_translation database table.
 * 
 */
@Entity
@Table(name="role_group_translation")
@NamedQuery(name="RoleGroupTranslation.findAll", query="SELECT rgt FROM RoleGroupTranslation rgt")
public class RoleGroupTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to RoleGroup
	@ManyToOne
	@JoinColumn(name="role_group_id")
	@JsonBackReference(value = "RoleGroup-RoleGroupTranslation")
	private RoleGroup roleGroup;

	public RoleGroupTranslation() {
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

	public RoleGroup getRoleGroup() {
		return this.roleGroup;
	}

	public void setRoleGroup(RoleGroup roleGroup) {
		this.roleGroup = roleGroup;
	}

}