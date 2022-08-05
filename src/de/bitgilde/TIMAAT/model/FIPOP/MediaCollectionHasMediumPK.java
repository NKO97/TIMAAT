package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * The primary key class for the media_collection_has_medium database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Embeddable
public class MediaCollectionHasMediumPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="media_collection_id", insertable=false, updatable=false)
	private int mediaCollectionId;

	@Column(name="medium_id", insertable=false, updatable=false)
	private int mediumId;

	public MediaCollectionHasMediumPK() {
	}
	public MediaCollectionHasMediumPK(int mediaCollectionId, int mediumId) {
		this.mediaCollectionId = mediaCollectionId;
		this.mediumId = mediumId;
	}
	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}
	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}
	public int getMediumId() {
		return this.mediumId;
	}
	public void setMediumId(int mediumId) {
		this.mediumId = mediumId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediaCollectionHasMediumPK)) {
			return false;
		}
		MediaCollectionHasMediumPK castOther = (MediaCollectionHasMediumPK)other;
		return
			(this.mediaCollectionId == castOther.mediaCollectionId)
			&& (this.mediumId == castOther.mediumId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediaCollectionId;
		hash = hash * prime + this.mediumId;

		return hash;
	}
}