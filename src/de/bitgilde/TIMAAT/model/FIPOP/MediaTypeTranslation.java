package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;


/**
 * The persistent class for the media_type_translation database table.
 * 
 */
@Entity
@Table(name="media_type_translation")
@NamedQuery(name="MediaTypeTranslation.findAll", query="SELECT m FROM MediaTypeTranslation m")
public class MediaTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	// @JsonBackReference(value = "Language-MediaTypeTranslation")
	private Language language;

	//bi-directional many-to-one association to MediaType
	@ManyToOne
	@JoinColumn(name="media_type_id")
	@JsonBackReference(value = "MediaType-MediaTypeTranslation")
	private MediaType mediaType;

	public MediaTypeTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public MediaType getMediaType() {
		return this.mediaType;
	}

	public void setMediaType(MediaType mediaType) {
		this.mediaType = mediaType;
	}

}