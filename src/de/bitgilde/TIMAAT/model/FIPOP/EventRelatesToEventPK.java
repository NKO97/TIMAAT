package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the event_relates_to_event database table.
 * 
 */
@Embeddable
public class EventRelatesToEventPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int eventID;

	@Column(insertable=false, updatable=false)
	private int relates_to_EventID;

	@Column(insertable=false, updatable=false)
	private int event_Event_RelationshipTypeID;

	public EventRelatesToEventPK() {
	}
	public int getEventID() {
		return this.eventID;
	}
	public void setEventID(int eventID) {
		this.eventID = eventID;
	}
	public int getRelates_to_EventID() {
		return this.relates_to_EventID;
	}
	public void setRelates_to_EventID(int relates_to_EventID) {
		this.relates_to_EventID = relates_to_EventID;
	}
	public int getEvent_Event_RelationshipTypeID() {
		return this.event_Event_RelationshipTypeID;
	}
	public void setEvent_Event_RelationshipTypeID(int event_Event_RelationshipTypeID) {
		this.event_Event_RelationshipTypeID = event_Event_RelationshipTypeID;
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
			(this.eventID == castOther.eventID)
			&& (this.relates_to_EventID == castOther.relates_to_EventID)
			&& (this.event_Event_RelationshipTypeID == castOther.event_Event_RelationshipTypeID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.eventID;
		hash = hash * prime + this.relates_to_EventID;
		hash = hash * prime + this.event_Event_RelationshipTypeID;
		
		return hash;
	}
}