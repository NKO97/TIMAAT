package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the media_collection_has_work database table.
 * 
 */
@Entity
@Table(name="media_collection_has_work")
@NamedQuery(name="MediaCollectionHasWork.findAll", query="SELECT m FROM MediaCollectionHasWork m")
public class MediaCollectionHasWork implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediaCollectionHasWorkPK id;

	//bi-directional many-to-one association to MediaCollection
	@ManyToOne
	@JoinColumn(name="media_collection_id", nullable=false, insertable=false, updatable=false)
	private MediaCollection mediaCollection;

	public MediaCollectionHasWork() {
	}

	public MediaCollectionHasWorkPK getId() {
		return this.id;
	}

	public void setId(MediaCollectionHasWorkPK id) {
		this.id = id;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}