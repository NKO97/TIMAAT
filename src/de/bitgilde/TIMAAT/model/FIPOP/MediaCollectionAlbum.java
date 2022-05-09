package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;


/**
 * The persistent class for the media_collection_album database table.
 *
 */
@Entity
@Table(name="media_collection_album")
@NamedQuery(name="MediaCollectionAlbum.findAll", query="SELECT mca FROM MediaCollectionAlbum mca")
public class MediaCollectionAlbum implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(name="media_collection_id", unique=true, nullable=false)
	@Column(name="media_collection_id")
	private int mediaCollectionId;

	private int tracks;

	//bi-directional one-to-one association to MediaCollection
	@OneToOne
	@PrimaryKeyJoinColumn(name="media_collection_id")
	// @JoinColumn(name="media_collection_id", nullable=false, insertable=false, updatable=false)
	@JsonIgnore // MediaCollectionAlbum is accessed through MediumCollection --> avoid reference cycle
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