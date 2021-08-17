package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the media_collection_type database table.
 * 
 */
@Entity
@Table(name="media_collection_type")
@NamedQuery(name="MediaCollectionType.findAll", query="SELECT mct FROM MediaCollectionType mct")
public class MediaCollectionType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(unique=true, nullable=false)
	private int id;

	//bi-directional many-to-one association to MediaCollection
	@OneToMany(mappedBy="mediaCollectionType")
	// @JsonBackReference
	@JsonIgnore
	private List<MediaCollection> mediaCollections;

	//bi-directional many-to-one association to MediaCollectionTypeTranslation
	@OneToMany(mappedBy="mediaCollectionType")
	// @JsonManagedReference(value = "MediaCollectionType-MediaCollectionTypeTranslation")
	private List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations;

	public MediaCollectionType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<MediaCollection> getMediaCollections() {
		return this.mediaCollections;
	}

	public void setMediaCollections(List<MediaCollection> mediaCollections) {
		this.mediaCollections = mediaCollections;
	}

	public MediaCollection addMediaCollection(MediaCollection mediaCollection) {
		getMediaCollections().add(mediaCollection);
		mediaCollection.setMediaCollectionType(this);

		return mediaCollection;
	}

	public MediaCollection removeMediaCollection(MediaCollection mediaCollection) {
		getMediaCollections().remove(mediaCollection);
		mediaCollection.setMediaCollectionType(null);

		return mediaCollection;
	}

	public List<MediaCollectionTypeTranslation> getMediaCollectionTypeTranslations() {
		return this.mediaCollectionTypeTranslations;
	}

	public void setMediaCollectionTypeTranslations(List<MediaCollectionTypeTranslation> mediaCollectionTypeTranslations) {
		this.mediaCollectionTypeTranslations = mediaCollectionTypeTranslations;
	}

	public MediaCollectionTypeTranslation addMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
		getMediaCollectionTypeTranslations().add(mediaCollectionTypeTranslation);
		mediaCollectionTypeTranslation.setMediaCollectionType(this);

		return mediaCollectionTypeTranslation;
	}

	public MediaCollectionTypeTranslation removeMediaCollectionTypeTranslation(MediaCollectionTypeTranslation mediaCollectionTypeTranslation) {
		getMediaCollectionTypeTranslations().remove(mediaCollectionTypeTranslation);
		mediaCollectionTypeTranslation.setMediaCollectionType(null);

		return mediaCollectionTypeTranslation;
	}

}