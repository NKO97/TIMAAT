package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the actor_has_emailaddress database table.
 * 
 */
@Embeddable
public class ActorHasEmailaddressPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int actorID;

	@Column(insertable=false, updatable=false)
	private int emailAddressID;

	public ActorHasEmailaddressPK() {
	}
	public int getActorID() {
		return this.actorID;
	}
	public void setActorID(int actorID) {
		this.actorID = actorID;
	}
	public int getEmailAddressID() {
		return this.emailAddressID;
	}
	public void setEmailAddressID(int emailAddressID) {
		this.emailAddressID = emailAddressID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorHasEmailaddressPK)) {
			return false;
		}
		ActorHasEmailaddressPK castOther = (ActorHasEmailaddressPK)other;
		return 
			(this.actorID == castOther.actorID)
			&& (this.emailAddressID == castOther.emailAddressID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorID;
		hash = hash * prime + this.emailAddressID;
		
		return hash;
	}
}