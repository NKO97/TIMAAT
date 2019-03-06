package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the Medium_has_Title database table.
 * 
 */
@Embeddable
public class Medium_has_TitlePK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	private int mediumID;

	private int titleID;

	public Medium_has_TitlePK() {
	}
	public int getMediumID() {
		return this.mediumID;
	}
	public void setMediumID(int mediumID) {
		this.mediumID = mediumID;
	}
	public int getTitleID() {
		return this.titleID;
	}
	public void setTitleID(int titleID) {
		this.titleID = titleID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof Medium_has_TitlePK)) {
			return false;
		}
		Medium_has_TitlePK castOther = (Medium_has_TitlePK)other;
		return 
			(this.mediumID == castOther.mediumID)
			&& (this.titleID == castOther.titleID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediumID;
		hash = hash * prime + this.titleID;
		
		return hash;
	}
}