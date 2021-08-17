package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

/**
 * The primary key class for the event_relates_to_event database table.
 * 
 */
@Embeddable
public class EventRelatesToEventPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="event_id", insertable=false, updatable=false)
	private int eventId;

	@Column(name="relates_to_event_id", insertable=false, updatable=false)
	private int relatesToEventId;

	@Column(name="event_event_relationship_type_id", insertable=false, updatable=false)
	private int eventEventRelationshipTypeId;

	public EventRelatesToEventPK() {
	}
	public int getEventId() {
		return this.eventId;
	}
	public void setEventId(int eventId) {
		this.eventId = eventId;
	}
	public int getRelatesToEventId() {
		return this.relatesToEventId;
	}
	public void setRelatesToEventId(int relatesToEventId) {
		this.relatesToEventId = relatesToEventId;
	}
	public int getEventEventRelationshipTypeId() {
		return this.eventEventRelationshipTypeId;
	}
	public void setEventEventRelationshipTypeId(int eventEventRelationshipTypeId) {
		this.eventEventRelationshipTypeId = eventEventRelationshipTypeId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof EventRelatesToEventPK)) {
			return false;
		}
		EventRelatesToEventPK castOther = (EventRelatesToEventPK)other;
		return 
			(this.eventId == castOther.eventId)
			&& (this.relatesToEventId == castOther.relatesToEventId)
			&& (this.eventEventRelationshipTypeId == castOther.eventEventRelationshipTypeId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.eventId;
		hash = hash * prime + this.relatesToEventId;
		hash = hash * prime + this.eventEventRelationshipTypeId;
		
		return hash;
	}
}