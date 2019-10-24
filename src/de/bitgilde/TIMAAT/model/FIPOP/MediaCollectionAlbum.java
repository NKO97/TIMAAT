package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the media_collection_album database table.
 * 
 */
@Entity
@Table(name="media_collection_album")
@NamedQuery(name="MediaCollectionAlbum.findAll", query="SELECT m FROM MediaCollectionAlbum m")
public class MediaCollectionAlbum implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="media_collection_id", unique=true, nullable=false)
	private int mediaCollectionId;

	private int tracks;

	//bi-directional one-to-one association to MediaCollection
	@OneToOne
	@JoinColumn(name="media_collection_id", nullable=false, insertable=false, updatable=false)
	private MediaCollection mediaCollection;

	public MediaCollectionAlbum() {
	}

	public int getMediaCollectionId() {
		return this.mediaCollectionId;
	}

	public void setMediaCollectionId(int mediaCollectionId) {
		this.mediaCollectionId = mediaCollectionId;
	}

	public int getTracks() {
		return this.tracks;
	}

	public void setTracks(int tracks) {
		this.tracks = tracks;
	}

	public MediaCollection getMediaCollection() {
		return this.mediaCollection;
	}

	public void setMediaCollection(MediaCollection mediaCollection) {
		this.mediaCollection = mediaCollection;
	}

}