package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the actor_is_located_in_country database table.
 * 
 */
@Embeddable
public class ActorIsLocatedInCountryPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int actorID;

	@Column(insertable=false, updatable=false)
	private int country_LocationID;

	public ActorIsLocatedInCountryPK() {
	}
	public int getActorID() {
		return this.actorID;
	}
	public void setActorID(int actorID) {
		this.actorID = actorID;
	}
	public int getCountry_LocationID() {
		return this.country_LocationID;
	}
	public void setCountry_LocationID(int country_LocationID) {
		this.country_LocationID = country_LocationID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ActorIsLocatedInCountryPK)) {
			return false;
		}
		ActorIsLocatedInCountryPK castOther = (ActorIsLocatedInCountryPK)other;
		return 
			(this.actorID == castOther.actorID)
			&& (this.country_LocationID == castOther.country_LocationID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorID;
		hash = hash * prime + this.country_LocationID;
		
		return hash;
	}
}