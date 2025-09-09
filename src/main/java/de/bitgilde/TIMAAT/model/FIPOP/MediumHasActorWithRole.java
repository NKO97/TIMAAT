package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;

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
 * The persistent class for the medium_has_actor_with_role database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_has_actor_with_role")
@NamedQuery(name="MediumHasActorWithRole.findAll", query="SELECT m FROM MediumHasActorWithRole m")
public class MediumHasActorWithRole implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumHasActorWithRolePK id;

	@JoinColumn(name="actor_has_role_actor_id", nullable=false)
	private Actor actor;

	@JoinColumn(name="actor_has_role_role_id", nullable=false)
	private Role role;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JoinColumn(name="medium_id")
	@JsonIgnore
	private Medium medium;

	public MediumHasActorWithRole() {
	}

	public MediumHasActorWithRolePK getId() {
		return this.id;
	}

	public void setId(MediumHasActorWithRolePK id) {
		this.id = id;
	}

	public Actor getActor() {
		return actor;
	}

	public void setActor(Actor actor) {
		this.actor = actor;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

}