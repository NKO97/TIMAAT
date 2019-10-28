package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the media_collection_has_tag database table.
 * 
 */
@Entity
@Table(name="media_collection_has_tag")
@NamedQuery(name="MediaCollectionHasTag.findAll", query="SELECT m FROM MediaCollectionHasTag m")
public class MediaCollectionHasTag implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediaCollectionHasTagPK id;

	@ManyToOne
	@JoinColumn(name="tag_id")
	private Tag tag;

	//bi-directional many-to-one association to MediaCollection
	@ManyToOne
	@JoinColumn(name="media_collection_id")
	private MediaCollection mediaCollection;

	public MediaCollectionHasTag() {
	}

	public MediaCollectionHasTagPK getId() {
		return this.id;
	}

	public void setId(MediaCollectionHasTagPK id) {
		this.id = id;
	}

	public Tag getTag() {
		return this.tag;
	}

	public void setTag(Tag tag) {
		this.tag = tag;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}