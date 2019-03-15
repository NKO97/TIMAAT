package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the AnalysisSegment database table.
 * 
 */
@Embeddable
public class AnalysisSegmentPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	private int id;

	@Column(insertable=false, updatable=false)
	private int analysisListID;

	public AnalysisSegmentPK() {
	}
	public int getId() {
		return this.id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getAnalysisListID() {
		return this.analysisListID;
	}
	public void setAnalysisListID(int analysisListID) {
		this.analysisListID = analysisListID;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof AnalysisSegmentPK)) {
			return false;
		}
		AnalysisSegmentPK castOther = (AnalysisSegmentPK)other;
		return 
			(this.id == castOther.id)
			&& (this.analysisListID == castOther.analysisListID);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.id;
		hash = hash * prime + this.analysisListID;
		
		return hash;
	}
}