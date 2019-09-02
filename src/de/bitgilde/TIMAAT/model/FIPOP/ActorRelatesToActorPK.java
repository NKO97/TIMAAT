package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the actor_relates_to_actor database table.
 * 
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