package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

/**
 * The primary key class for the actor_has_address database table.
 * 
 */
@Embeddable
public class ActorHasAddressPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false)
	private int actorId;

	@Column(name="address_id", insertable=false, updatable=false)
	private int addressId;

	public ActorHasAddressPK() {
	}
	
	public ActorHasAddressPK(int actorId, int addressId) {
		this.actorId = actorId;
		this.addressId = addressId;
	}

	public int getActorId() {
		return this.actorId;
	}

	public void setActorId(int actorId) {
		this.actorId = actorId;
	}

	public int getAddressId() {
		return this.addressId;
	}

	public void setAddressId(int addressId) {
		this.addressId = addressId;
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
			(this.actorId == castOther.actorId)
			&& (this.addressId == castOther.addressId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.addressId;
		
		return hash;
	}
}