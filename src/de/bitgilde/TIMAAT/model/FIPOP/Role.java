package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the role database table.
 * 
 */
@Entity
@NamedQuery(name="Role.findAll", query="SELECT r FROM Role r")
public class Role implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-many association to Actor
	// @ManyToMany
	// @JoinTable(
	// 	name="actor_has_role"
	// 	, joinColumns={
	// 		@JoinColumn(name="RoleID")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="ActorID")
	// 		}
	// 	)
	// private List<Actor> actors;

	//bi-directional many-to-many association to Rolegroup
	@ManyToMany(mappedBy="roles")
	private List<Rolegroup> rolegroups;

	//bi-directional many-to-one association to Roletranslation
	@OneToMany(mappedBy="role")
	private List<Roletranslation> roletranslations;

	//bi-directional many-to-one association to SioccontainerHasRoleRoleid
	// @OneToMany(mappedBy="role")
	// private List<SioccontainerHasRoleRoleid> sioccontainerHasRoleRoleids;

	//bi-directional many-to-one association to SioccontainerHasSiocuseraccount
	// @OneToMany(mappedBy="role")
	// private List<SioccontainerHasSiocuseraccount> sioccontainerHasSiocuseraccounts;

	//bi-directional many-to-one association to SiocsiteHasSiocuseraccount
	// @OneToMany(mappedBy="role")
	// private List<SiocsiteHasSiocuseraccount> siocsiteHasSiocuseraccounts;

	public Role() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	// public List<Actor> getActors() {
	// 	return this.actors;
	// }

	// public void setActors(List<Actor> actors) {
	// 	this.actors = actors;
	// }

	public List<Rolegroup> getRolegroups() {
		return this.rolegroups;
	}

	public void setRolegroups(List<Rolegroup> rolegroups) {
		this.rolegroups = rolegroups;
	}

	public List<Roletranslation> getRoletranslations() {
		return this.roletranslations;
	}

	public void setRoletranslations(List<Roletranslation> roletranslations) {
		this.roletranslations = roletranslations;
	}

	public Roletranslation addRoletranslation(Roletranslation roletranslation) {
		getRoletranslations().add(roletranslation);
		roletranslation.setRole(this);

		return roletranslation;
	}

	public Roletranslation removeRoletranslation(Roletranslation roletranslation) {
		getRoletranslations().remove(roletranslation);
		roletranslation.setRole(null);

		return roletranslation;
	}

	// public List<SioccontainerHasRoleRoleid> getSioccontainerHasRoleRoleids() {
	// 	return this.sioccontainerHasRoleRoleids;
	// }

	// public void setSioccontainerHasRoleRoleids(List<SioccontainerHasRoleRoleid> sioccontainerHasRoleRoleids) {
	// 	this.sioccontainerHasRoleRoleids = sioccontainerHasRoleRoleids;
	// }

	// public SioccontainerHasRoleRoleid addSioccontainerHasRoleRoleid(SioccontainerHasRoleRoleid sioccontainerHasRoleRoleid) {
	// 	getSioccontainerHasRoleRoleids().add(sioccontainerHasRoleRoleid);
	// 	sioccontainerHasRoleRoleid.setRole(this);

	// 	return sioccontainerHasRoleRoleid;
	// }

	// public SioccontainerHasRoleRoleid removeSioccontainerHasRoleRoleid(SioccontainerHasRoleRoleid sioccontainerHasRoleRoleid) {
	// 	getSioccontainerHasRoleRoleids().remove(sioccontainerHasRoleRoleid);
	// 	sioccontainerHasRoleRoleid.setRole(null);

	// 	return sioccontainerHasRoleRoleid;
	// }

	// public List<SioccontainerHasSiocuseraccount> getSioccontainerHasSiocuseraccounts() {
	// 	return this.sioccontainerHasSiocuseraccounts;
	// }

	// public void setSioccontainerHasSiocuseraccounts(List<SioccontainerHasSiocuseraccount> sioccontainerHasSiocuseraccounts) {
	// 	this.sioccontainerHasSiocuseraccounts = sioccontainerHasSiocuseraccounts;
	// }

	// public SioccontainerHasSiocuseraccount addSioccontainerHasSiocuseraccount(SioccontainerHasSiocuseraccount sioccontainerHasSiocuseraccount) {
	// 	getSioccontainerHasSiocuseraccounts().add(sioccontainerHasSiocuseraccount);
	// 	sioccontainerHasSiocuseraccount.setRole(this);

	// 	return sioccontainerHasSiocuseraccount;
	// }

	// public SioccontainerHasSiocuseraccount removeSioccontainerHasSiocuseraccount(SioccontainerHasSiocuseraccount sioccontainerHasSiocuseraccount) {
	// 	getSioccontainerHasSiocuseraccounts().remove(sioccontainerHasSiocuseraccount);
	// 	sioccontainerHasSiocuseraccount.setRole(null);

	// 	return sioccontainerHasSiocuseraccount;
	// }

	// public List<SiocsiteHasSiocuseraccount> getSiocsiteHasSiocuseraccounts() {
	// 	return this.siocsiteHasSiocuseraccounts;
	// }

	// public void setSiocsiteHasSiocuseraccounts(List<SiocsiteHasSiocuseraccount> siocsiteHasSiocuseraccounts) {
	// 	this.siocsiteHasSiocuseraccounts = siocsiteHasSiocuseraccounts;
	// }

	// public SiocsiteHasSiocuseraccount addSiocsiteHasSiocuseraccount(SiocsiteHasSiocuseraccount siocsiteHasSiocuseraccount) {
	// 	getSiocsiteHasSiocuseraccounts().add(siocsiteHasSiocuseraccount);
	// 	siocsiteHasSiocuseraccount.setRole(this);

	// 	return siocsiteHasSiocuseraccount;
	// }

	// public SiocsiteHasSiocuseraccount removeSiocsiteHasSiocuseraccount(SiocsiteHasSiocuseraccount siocsiteHasSiocuseraccount) {
	// 	getSiocsiteHasSiocuseraccounts().remove(siocsiteHasSiocuseraccount);
	// 	siocsiteHasSiocuseraccount.setRole(null);

	// 	return siocsiteHasSiocuseraccount;
	// }

}