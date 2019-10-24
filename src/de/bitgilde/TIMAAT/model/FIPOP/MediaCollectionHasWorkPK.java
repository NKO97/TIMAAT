package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the media_collection_has_work database table.
 * 
 */
@Embeddable
public class MediaCollectionHasWorkPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="media_collection_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int mediaCollectionId;

	@Column(name="work_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int workId;

	public MediaCollectionHasWorkPK() {
	}
	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}
	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}
	public int getWorkId() {
		return this.workId;
	}
	public void setWorkId(int workId) {
		this.workId = workId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediaCollectionHasWorkPK)) {
			return false;
		}
		MediaCollectionHasWorkPK castOther = (MediaCollectionHasWorkPK)other;
		return 
			(this.mediaCollectionId == castOther.mediaCollectionId)
			&& (this.workId == castOther.workId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediaCollectionId;
		hash = hash * prime + this.workId;
		
		return hash;
	}
}