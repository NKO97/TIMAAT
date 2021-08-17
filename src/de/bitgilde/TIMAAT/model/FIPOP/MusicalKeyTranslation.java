package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the musical_key_translation database table.
 * 
 */
@Entity
@Table(name="musical_key_translation")
@NamedQuery(name="MusicalKeyTranslation.findAll", query="SELECT m FROM MusicalKeyTranslation m")
public class MusicalKeyTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MusicalKey
	@ManyToOne
	@JoinColumn(name="musical_key_id")
	@JsonIgnore
	private MusicalKey musicalKey;

	public MusicalKeyTranslation() {
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

	public MusicalKey getMusicalKey() {
		return this.musicalKey;
	}

	public void setMusicalKey(MusicalKey musicalKey) {
		this.musicalKey = musicalKey;
	}

}