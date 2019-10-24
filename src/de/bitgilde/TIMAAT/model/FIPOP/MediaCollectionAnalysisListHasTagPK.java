package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

/**
 * The primary key class for the media_collection_analysis_list_has_tag database table.
 * 
 */
@Embeddable
public class MediaCollectionAnalysisListHasTagPK implements Serializable {
	//default serial version id, required for serializable classes.
	private static final long serialVersionUID = 1L;

	@Column(name="media_collection_analysis_list_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int mediaCollectionAnalysisListId;

	@Column(name="tag_id", insertable=false, updatable=false, unique=true, nullable=false)
	private int tagId;

	public MediaCollectionAnalysisListHasTagPK() {
	}
	public int getMediaCollectionAnalysisListId() {
		return this.mediaCollectionAnalysisListId;
	}
	public void setMediaCollectionAnalysisListId(int mediaCollectionAnalysisListId) {
		this.mediaCollectionAnalysisListId = mediaCollectionAnalysisListId;
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
		if (!(other instanceof MediaCollectionAnalysisListHasTagPK)) {
			return false;
		}
		MediaCollectionAnalysisListHasTagPK castOther = (MediaCollectionAnalysisListHasTagPK)other;
		return 
			(this.mediaCollectionAnalysisListId == castOther.mediaCollectionAnalysisListId)
			&& (this.tagId == castOther.tagId);
	}

	public int hashCode() {
		final int prime = 31;
		int hash = 17;
		hash = hash * prime + this.mediaCollectionAnalysisListId;
		hash = hash * prime + this.tagId;
		
		return hash;
	}
}