package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the role database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@NamedQuery(name="Role.findAll", query="SELECT r FROM Role r")
public class Role implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-many association to Actor
	// @ManyToMany
	// @JsonIgnore
	// @JoinTable(
	// 	name="actor_has_role"
	// 	, joinColumns={
	// 		@JoinColumn(name="role_id")
	// 		}
	// 	, inverseJoinColumns={
	// 		@JoinColumn(name="actor_id")
	// 		}
	// 	)
	// private List<Actor> actors;

	//bi-directional many-to-many association to RoleGroup
	@ManyToMany(mappedBy="roles")
	@JsonIgnore
	private List<Actor> actors;

	//bi-directional many-to-many association to RoleGroup
	@ManyToMany(mappedBy="roles")
	@JsonIgnore
	private List<RoleGroup> roleGroups;

	//bi-directional many-to-one association to RoleTranslation
	@OneToMany(mappedBy="role", cascade = CascadeType.PERSIST)
	private List<RoleTranslation> roleTranslations;

	//bi-directional many-to-one association to MembershipDetail
	@OneToMany(mappedBy="role")
	@JsonIgnore
	private List<MembershipDetail> membershipDetails;

	// tables cannot contain identifier id alone, or a query exception is thrown
	@Column(columnDefinition = "BOOLEAN")
	private Boolean dummy;

	public Role() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<Actor> getActors() {
		return this.actors;
	}

	public void setActors(List<Actor> actors) {
		this.actors = actors;
	}

	public Actor addActor(Actor actor) {
		getActors().add(actor);
		// actor.addRole(this);

		return actor;
	}

	public Actor removeActor(Actor actor) {
		getActors().remove(actor);
		// actor.removeRole(this);

		return actor;
	}

	public List<RoleGroup> getRoleGroups() {
		return this.roleGroups;
	}

	public void setRoleGroups(List<RoleGroup> roleGroups) {
		this.roleGroups = roleGroups;
	}

	public RoleGroup addRoleGroup(RoleGroup roleGroup) {
		getRoleGroups().add(roleGroup);
		roleGroup.addRole(this);

		return roleGroup;
	}

	public RoleGroup removeRoleGroup(RoleGroup roleGroup) {
		getRoleGroups().remove(roleGroup);
		roleGroup.removeRole(this);

		return roleGroup;
	}

	public List<RoleTranslation> getRoleTranslations() {
		return this.roleTranslations;
	}

	public void setRoleTranslations(List<RoleTranslation> roleTranslations) {
		this.roleTranslations = roleTranslations;
	}

	public RoleTranslation addRoleTranslation(RoleTranslation roleTranslation) {
		getRoleTranslations().add(roleTranslation);
		roleTranslation.setRole(this);

		return roleTranslation;
	}

	public RoleTranslation removeRoleTranslation(RoleTranslation roleTranslation) {
		getRoleTranslations().remove(roleTranslation);
		roleTranslation.setRole(null);

		return roleTranslation;
	}

	public List<MembershipDetail> getMembershipDetails() {
		return this.membershipDetails;
	}

	public void setMembershipDetails(List<MembershipDetail> membershipDetails) {
		this.membershipDetails = membershipDetails;
	}

	public MembershipDetail addMembershipDetail(MembershipDetail membershipDetail) {
		getMembershipDetails().add(membershipDetail);
		membershipDetail.setRole(this);

		return membershipDetail;
	}

	public MembershipDetail removeMembershipDetail(MembershipDetail membershipDetail) {
		getMembershipDetails().remove(membershipDetail);
		membershipDetail.setRole(null);

		return membershipDetail;
	}

}