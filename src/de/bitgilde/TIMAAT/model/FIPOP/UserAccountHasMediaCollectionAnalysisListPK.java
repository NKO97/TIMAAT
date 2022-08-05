package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the user_account_has_media_collection_analysis_list database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class UserAccountHasMediaCollectionAnalysisListPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="user_account_id", insertable=false, updatable=false)
	private int userAccountId;

	@Column(name="media_collection_analysis_list_id", insertable=false, updatable=false)
	private int mediaCollectionAnalysisListId;

	public UserAccountHasMediaCollectionAnalysisListPK() {
	}
	public UserAccountHasMediaCollectionAnalysisListPK(int userAccountId, int mediaCollectionAnalysisListId) {
		this.userAccountId = userAccountId;
		this.mediaCollectionAnalysisListId = mediaCollectionAnalysisListId;
	}
	public int getUserAccountId() {
		return this.userAccountId;
	}
	public void setUserAccountId(int userAccountId) {
		this.userAccountId = userAccountId;
	}
	public int getMediaCollectionAnalysisListId() {
		return this.mediaCollectionAnalysisListId;
	}
	public void setMediaCollectionAnalysisListId(int mediaCollectionAnalysisListId) {
		this.mediaCollectionAnalysisListId = mediaCollectionAnalysisListId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserAccountHasMediaCollectionAnalysisListPK)) {
			return false;
		}
		UserAccountHasMediaCollectionAnalysisListPK castOther = (UserAccountHasMediaCollectionAnalysisListPK)other;
		return
			(this.userAccountId == castOther.userAccountId)
			&& (this.mediaCollectionAnalysisListId == castOther.mediaCollectionAnalysisListId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.userAccountId;
		hash = hash * prime + this.mediaCollectionAnalysisListId;

		return hash;
	}
}