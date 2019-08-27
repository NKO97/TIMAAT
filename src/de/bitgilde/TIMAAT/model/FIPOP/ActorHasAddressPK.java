package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the actor_has_address database table.
 * 
 */
@Embeddable
public class ActorHasAddressPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int actorID;

	@Column(insertable=false, updatable=false)
	private int addressID;

	public ActorHasAddressPK() {
	}
	public int getActorID() {
		return this.actorID;
	}
	public void setActorID(int actorID) {
		this.actorID = actorID;
	}
	public int getAddressID() {
		return this.addressID;
	}
	public void setAddressID(int addressID) {
		this.addressID = addressID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasAddressPK)) {
			return false;
		}
		ActorHasAddressPK castOther = (ActorHasAddressPK)other;
		return 
			(this.actorID == castOther.actorID)
			&& (this.addressID == castOther.addressID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorID;
		hash = hash * prime + this.addressID;
		
		return hash;
	}
}