package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the _is_member_of_collective database table.
 * 
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