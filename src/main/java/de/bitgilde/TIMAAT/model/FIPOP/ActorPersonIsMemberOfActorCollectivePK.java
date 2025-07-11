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
 * The primary key class for the _is_member_of_actor_collective database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class ActorPersonIsMemberOfActorCollectivePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_person_actor_id", insertable=false, updatable=false)
	private int actorPersonActorId;

	@Column(name="member_of_actor_collective_actor_id", insertable=false, updatable=false)
	private int memberOfActorCollectiveActorId;

	public ActorPersonIsMemberOfActorCollectivePK() {
	}
	public ActorPersonIsMemberOfActorCollectivePK(int actorId, int collectiveId) {
		this.actorPersonActorId = actorId;
		this.memberOfActorCollectiveActorId = collectiveId;
	}
	public int getActorPersonActorId() {
		return this.actorPersonActorId;
	}
	public void setActorPersonActorId(int actorPersonActorId) {
		this.actorPersonActorId = actorPersonActorId;
	}
	public int getMemberOfActorCollectiveActorId() {
		return this.memberOfActorCollectiveActorId;
	}
	public void setMemberOfActorCollectiveActorId(int memberOfActorCollectiveActorId) {
		this.memberOfActorCollectiveActorId = memberOfActorCollectiveActorId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorPersonIsMemberOfActorCollectivePK)) {
			return false;
		}
		ActorPersonIsMemberOfActorCollectivePK castOther = (ActorPersonIsMemberOfActorCollectivePK)other;
		return
			(this.actorPersonActorId == castOther.actorPersonActorId)
			&& (this.memberOfActorCollectiveActorId == castOther.memberOfActorCollectiveActorId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorPersonActorId;
		hash = hash * prime + this.memberOfActorCollectiveActorId;

		return hash;
	}
}