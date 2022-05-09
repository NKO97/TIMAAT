package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the actor_has_phone_number database table.
 *
 */
@Embeddable
public class ActorHasPhoneNumberPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false)
	private int actorId;

	@Column(name="phone_number_id", insertable=false, updatable=false)
	private int phoneNumberId;

	public ActorHasPhoneNumberPK() {
	}

	public ActorHasPhoneNumberPK(int actorId, int phoneNumberId) {
		this.actorId = actorId;
		this.phoneNumberId = phoneNumberId;
	}

	public int getActorId() {
		return this.actorId;
	}

	public void setActorId(int actorId) {
		this.actorId = actorId;
	}

	public int getPhoneNumberId() {
		return this.phoneNumberId;
	}

	public void setPhoneNumberId(int phoneNumberId) {
		this.phoneNumberId = phoneNumberId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasPhoneNumberPK)) {
			return false;
		}
		ActorHasPhoneNumberPK castOther = (ActorHasPhoneNumberPK)other;
		return
			(this.actorId == castOther.actorId)
			&& (this.phoneNumberId == castOther.phoneNumberId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.phoneNumberId;

		return hash;
	}
}