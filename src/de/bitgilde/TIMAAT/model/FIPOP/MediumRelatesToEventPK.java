package de.bitgilde.TIMAAT.model.FIPOP;
import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the medium_relates_to_event database table.
 * 
 */
@Embeddable
public class MediumRelatesToEventPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int mediumID;

	@Column(insertable=false, updatable=false)
	private int eventID;

	@Column(insertable=false, updatable=false)
	private int medium_Event_RelationshipTypeID;

	public MediumRelatesToEventPK() {
	}
	public int getMediumID() {
		return this.mediumID;
	}
	public void setMediumID(int mediumID) {
		this.mediumID = mediumID;
	}
	public int getEventID() {
		return this.eventID;
	}
	public void setEventID(int eventID) {
		this.eventID = eventID;
	}
	public int getMedium_Event_RelationshipTypeID() {
		return this.medium_Event_RelationshipTypeID;
	}
	public void setMedium_Event_RelationshipTypeID(int medium_Event_RelationshipTypeID) {
		this.medium_Event_RelationshipTypeID = medium_Event_RelationshipTypeID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediumRelatesToEventPK)) {
			return false;
		}
		MediumRelatesToEventPK castOther = (MediumRelatesToEventPK)other;
		return 
			(this.mediumID == castOther.mediumID)
			&& (this.eventID == castOther.eventID)
			&& (this.medium_Event_RelationshipTypeID == castOther.medium_Event_RelationshipTypeID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumID;
		hash = hash * prime + this.eventID;
		hash = hash * prime + this.medium_Event_RelationshipTypeID;
		
		return hash;
	}
}