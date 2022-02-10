package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the music_type_translation database table.
 *
 */
@Entity
@Table(name="music_form_element_type_translation")
@NamedQuery(name="MusicFormElementTypeTranslation.findAll", query="SELECT m FROM MusicFormElementTypeTranslation m")
public class MusicFormElementTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MusicFormElementType
	@ManyToOne
	@JoinColumn(name="music_form_element_type_id")
	@JsonIgnore
	private MusicFormElementType musicFormElementType;

	public MusicFormElementTypeTranslation() {
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

	public MusicFormElementType getMusicFormElementType() {
		return this.musicFormElementType;
	}

	public void setMusicFormElementType(MusicFormElementType musicFormElementType) {
		this.musicFormElementType = musicFormElementType;
	}

}