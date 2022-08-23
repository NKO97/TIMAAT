package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

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
 * The primary key class for the actor_has_role database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class ActorHasRolePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false) // PK table would not be necessary for plain actor_has_role-table. Since other tables link to this table, the PK table is needed
	private int actorId;

	@Column(name="role_id", insertable=false, updatable=false)
	private int roleId;

	public ActorHasRolePK() {
	}

	public ActorHasRolePK(int actorId, int roleId) {
		this.actorId = actorId;
		this.roleId = roleId;
	}

	public int getActorId() {
		return this.actorId;
	}
	public void setActorId(int actorId) {
		this.actorId = actorId;
	}
	public int getRoleId() {
		return this.roleId;
	}
	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasRolePK)) {
			return false;
		}
		ActorHasRolePK castOther = (ActorHasRolePK)other;
		return
			(this.actorId == castOther.actorId)
			&& (this.roleId == castOther.roleId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.roleId;

		return hash;
	}
}