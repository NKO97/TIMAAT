package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the user_account_has_medium_analysis_list database table.
 * 
 */
@Embeddable
public class UserAccountHasMediumAnalysisListPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="user_account_id", insertable=false, updatable=false)
	private int userAccountId;

	@Column(name="medium_analysis_list_id", insertable=false, updatable=false)
	private int mediumAnalysisListId;

	public UserAccountHasMediumAnalysisListPK() {
	}
	public UserAccountHasMediumAnalysisListPK(int userAccountId, int mediumAnalysisListId) {
		this.userAccountId = userAccountId;
		this.mediumAnalysisListId = mediumAnalysisListId;
	}
	public int getUserAccountId() {
		return this.userAccountId;
	}
	public void setUserAccountId(int userAccountId) {
		this.userAccountId = userAccountId;
	}
	public int getMediumAnalysisListId() {
		return this.mediumAnalysisListId;
	}
	public void setMediumAnalysisListId(int mediumAnalysisListId) {
		this.mediumAnalysisListId = mediumAnalysisListId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserAccountHasMediumAnalysisListPK)) {
			return false;
		}
		UserAccountHasMediumAnalysisListPK castOther = (UserAccountHasMediumAnalysisListPK)other;
		return 
			(this.userAccountId == castOther.userAccountId)
			&& (this.mediumAnalysisListId == castOther.mediumAnalysisListId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.userAccountId;
		hash = hash * prime + this.mediumAnalysisListId;
		
		return hash;
	}
}