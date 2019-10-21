package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the role_group database table.
 * 
 */
@Entity
@Table(name="role_group")
@NamedQuery(name="RoleGroup.findAll", query="SELECT r FROM RoleGroup r")
public class RoleGroup implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Role
	@ManyToMany
	@JoinTable(
		name="role_group_has_role"
		, joinColumns={
			@JoinColumn(name="role_group_id")
			}
		, inverseJoinColumns={
			@JoinColumn(name="role_id")
			}
		)
	private List<Role> roles;

	//bi-directional many-to-one association to RoleGroupTranslation
	@OneToMany(mappedBy="roleGroup")
	@JsonManagedReference(value = "RoleGroup-RoleGroupTranslation")
	private List<RoleGroupTranslation> roleGroupTranslations;

	public RoleGroup() {
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

	public List<RoleGroupTranslation> getRoleGroupTranslations() {
		return this.roleGroupTranslations;
	}

	public void setRoleGroupTranslations(List<RoleGroupTranslation> roleGroupTranslations) {
		this.roleGroupTranslations = roleGroupTranslations;
	}

	public RoleGroupTranslation addRoleGroupTranslation(RoleGroupTranslation roleGroupTranslation) {
		getRoleGroupTranslations().add(roleGroupTranslation);
		roleGroupTranslation.setRoleGroup(this);

		return roleGroupTranslation;
	}

	public RoleGroupTranslation removeRoleGroupTranslation(RoleGroupTranslation roleGroupTranslation) {
		getRoleGroupTranslations().remove(roleGroupTranslation);
		roleGroupTranslation.setRoleGroup(null);

		return roleGroupTranslation;
	}

}