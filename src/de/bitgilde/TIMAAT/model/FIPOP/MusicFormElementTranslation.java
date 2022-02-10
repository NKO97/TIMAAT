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
@Table(name="music_form_element_translation")
@NamedQuery(name="MusicFormElementTranslation.findAll", query="SELECT m FROM MusicFormElementTranslation m")
public class MusicFormElementTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String text;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MusicFormElement
	@ManyToOne
	@JoinColumn(name="music_form_element_id")
	@JsonIgnore
	private MusicFormElement musicFormElement;

	public MusicFormElementTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getText() {
		return this.text;
	}

	public void setText(String type) {
		this.text = type;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public MusicFormElement getMusicFormElement() {
		return this.musicFormElement;
	}

	public void setMusicFormElement(MusicFormElement musicFormElement) {
		this.musicFormElement = musicFormElement;
	}

}