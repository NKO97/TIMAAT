package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the ReferenceDataFieldRequirements database table.
 * 
 */
@Embeddable
public class ReferenceDataFieldRequirementPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(insertable=false, updatable=false)
	private int referenceEntryTypeID;

	@Column(insertable=false, updatable=false)
	private int referenceID;

	public ReferenceDataFieldRequirementPK() {
	}
	public int getReferenceEntryTypeID() {
		return this.referenceEntryTypeID;
	}
	public void setReferenceEntryTypeID(int referenceEntryTypeID) {
		this.referenceEntryTypeID = referenceEntryTypeID;
	}
	public int getReferenceID() {
		return this.referenceID;
	}
	public void setReferenceID(int referenceID) {
		this.referenceID = referenceID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof ReferenceDataFieldRequirementPK)) {
			return false;
		}
		ReferenceDataFieldRequirementPK castOther = (ReferenceDataFieldRequirementPK)other;
		return 
			(this.referenceEntryTypeID == castOther.referenceEntryTypeID)
			&& (this.referenceID == castOther.referenceID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.referenceEntryTypeID;
		hash = hash * prime + this.referenceID;
		
		return hash;
	}
}