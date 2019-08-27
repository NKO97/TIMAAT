package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the rolegroup database table.
 * 
 */
@Entity
@NamedQuery(name="Rolegroup.findAll", query="SELECT r FROM Rolegroup r")
public class Rolegroup implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Role
	@ManyToMany
	@JoinTable(
		name="rolegroup_has_role"
		, joinColumns={
			@JoinColumn(name="RoleGroupID")
			}
		, inverseJoinColumns={
			@JoinColumn(name="RoleID")
			}
		)
	private List<Role> roles;

	//bi-directional many-to-one association to Rolegrouptranslation
	@OneToMany(mappedBy="rolegroup")
	private List<Rolegrouptranslation> rolegrouptranslations;

	public Rolegroup() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Role> getRoles() {
		return this.roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	public List<Rolegrouptranslation> getRolegrouptranslations() {
		return this.rolegrouptranslations;
	}

	public void setRolegrouptranslations(List<Rolegrouptranslation> rolegrouptranslations) {
		this.rolegrouptranslations = rolegrouptranslations;
	}

	public Rolegrouptranslation addRolegrouptranslation(Rolegrouptranslation rolegrouptranslation) {
		getRolegrouptranslations().add(rolegrouptranslation);
		rolegrouptranslation.setRolegroup(this);

		return rolegrouptranslation;
	}

	public Rolegrouptranslation removeRolegrouptranslation(Rolegrouptranslation rolegrouptranslation) {
		getRolegrouptranslations().remove(rolegrouptranslation);
		rolegrouptranslation.setRolegroup(null);

		return rolegrouptranslation;
	}

}