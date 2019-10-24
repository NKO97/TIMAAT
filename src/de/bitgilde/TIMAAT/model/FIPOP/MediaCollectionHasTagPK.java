package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the media_collection_has_tag database table.
 * 
 */
@Embeddable
public class MediaCollectionHasTagPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="media_collection_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int mediaCollectionId;

	@Column(name="tag_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int tagId;

	public MediaCollectionHasTagPK() {
	}
	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}
	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}
	public int getTagId() {
		return this.tagId;
	}
	public void setTagId(int tagId) {
		this.tagId = tagId;
	}

	public boolean equals(Object other) {
		if (this == other) {
			return true;
		}
		if (!(other instanceof MediaCollectionHasTagPK)) {
			return false;
		}
		MediaCollectionHasTagPK castOther = (MediaCollectionHasTagPK)other;
		return 
			(this.mediaCollectionId == castOther.mediaCollectionId)
			&& (this.tagId == castOther.tagId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediaCollectionId;
		hash = hash * prime + this.tagId;
		
		return hash;
	}
}