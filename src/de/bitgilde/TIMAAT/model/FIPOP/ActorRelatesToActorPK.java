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

	@Column(insertable=false, updatable=false)
	private int actorID;

	@Column(insertable=false, updatable=false)
	private int relates_to_ActorID;

	public ActorRelatesToActorPK() {
	}
	public int getActorID() {
		return this.actorID;
	}
	public void setActorID(int actorID) {
		this.actorID = actorID;
	}
	public int getRelates_to_ActorID() {
		return this.relates_to_ActorID;
	}
	public void setRelates_to_ActorID(int relates_to_ActorID) {
		this.relates_to_ActorID = relates_to_ActorID;
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
			(this.actorID == castOther.actorID)
			&& (this.relates_to_ActorID == castOther.relates_to_ActorID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorID;
		hash = hash * prime + this.relates_to_ActorID;
		
		return hash;
	}
}