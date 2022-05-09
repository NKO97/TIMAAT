package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the actor_is_located_in_country database table.
 *
 */
@Embeddable
public class ActorIsLocatedInCountryPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="actor_id", insertable=false, updatable=false)
	private int actorId;

	@Column(name="country_location_id", insertable=false, updatable=false)
	private int countryLocationId;

	public ActorIsLocatedInCountryPK() {
	}
	public int getActorId() {
		return this.actorId;
	}
	public void setActorId(int actorId) {
		this.actorId = actorId;
	}
	public int getCountryLocationId() {
		return this.countryLocationId;
	}
	public void setCountryLocationId(int countryLocationId) {
		this.countryLocationId = countryLocationId;
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
			(this.actorId == castOther.actorId)
			&& (this.countryLocationId == castOther.countryLocationId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.actorId;
		hash = hash * prime + this.countryLocationId;

		return hash;
	}
}