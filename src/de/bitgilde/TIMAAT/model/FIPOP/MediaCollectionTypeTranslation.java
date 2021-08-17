package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the media_collection_type_translation database table.
 * 
 */
@Entity
@Table(name="media_collection_type_translation")
@NamedQuery(name="MediaCollectionTypeTranslation.findAll", query="SELECT mctt FROM MediaCollectionTypeTranslation mctt")
public class MediaCollectionTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	// @GeneratedValue(strategy=GenerationType.IDENTITY)
	// @Column(unique=true, nullable=false)
	private int id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @Column(name="language_id", nullable=false)
	private Language language;

	// @Column(nullable=false, length=45)
	private String type;

	//bi-directional many-to-one association to MediaCollectionType
	@ManyToOne
	@JoinColumn(name="media_collection_type_id", nullable=false)
	@JsonIgnore
	// @JsonBackReference(value = "MediaCollectionType-MediaCollectionTypeTranslation")
	private MediaCollectionType mediaCollectionType;

	public MediaCollectionTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public MediaCollectionType getMediaCollectionType() {
		return this.mediaCollectionType;
	}

	public void setMediaCollectionType(MediaCollectionType mediaCollectionType) {
		this.mediaCollectionType = mediaCollectionType;
	}

}