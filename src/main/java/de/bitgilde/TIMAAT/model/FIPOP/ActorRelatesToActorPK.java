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
 * The primary key class for the actor_relates_to_actor database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class ActorRelatesToActorPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false)
	private int actorId;

	@Column(name="relates_to_actor_id", insertable=false, updatable=false)
	private int relatesToActorId;

	public ActorRelatesToActorPK() {
	}
	public int getActorId() {
		return this.actorId;
	}
	public void setActorId(int actorId) {
		this.actorId = actorId;
	}
	public int getRelatesToActorId() {
		return this.relatesToActorId;
	}
	public void setRelatesToActorId(int relatesToActorId) {
		this.relatesToActorId = relatesToActorId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorRelatesToActorPK)) {
			return false;
		}
		ActorRelatesToActorPK castOther = (ActorRelatesToActorPK)other;
		return
			(this.actorId == castOther.actorId)
			&& (this.relatesToActorId == castOther.relatesToActorId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.relatesToActorId;

		return hash;
	}
}