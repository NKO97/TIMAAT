package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the user_account_has_media_collection database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class UserAccountHasMediaCollectionPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="user_account_id", insertable=false, updatable=false)
	private int userAccountId;

	@Column(name="media_collection_id", insertable=false, updatable=false)
	private int mediaCollectionId;

	public UserAccountHasMediaCollectionPK() {
	}
	public UserAccountHasMediaCollectionPK(int userAccountId, int mediaCollectionId) {
		this.userAccountId = userAccountId;
		this.mediaCollectionId = mediaCollectionId;
	}
	public int getUserAccountId() {
		return this.userAccountId;
	}
	public void setUserAccountId(int userAccountId) {
		this.userAccountId = userAccountId;
	}
	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}
	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof UserAccountHasMediaCollectionPK)) {
			return false;
		}
		UserAccountHasMediaCollectionPK castOther = (UserAccountHasMediaCollectionPK)other;
		return
			(this.userAccountId == castOther.userAccountId)
			&& (this.mediaCollectionId == castOther.mediaCollectionId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.userAccountId;
		hash = hash * prime + this.mediaCollectionId;

		return hash;
	}
}