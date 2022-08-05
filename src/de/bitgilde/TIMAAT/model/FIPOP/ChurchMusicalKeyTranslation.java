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
 * The persistent class for the church_musical_key_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="church_musical_key_translation")
@NamedQuery(name="ChurchMusicalKeyTranslation.findAll", query="SELECT cmtt FROM ChurchMusicalKeyTranslation cmtt")
public class ChurchMusicalKeyTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	private String type;

	//bi-directional many-to-one association to ChurchMusicalKey
	@ManyToOne
	@JoinColumn(name="church_musical_key_id")
	@JsonIgnore
	private ChurchMusicalKey churchMusicalKey;

	public ChurchMusicalKeyTranslation() {
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

	public ChurchMusicalKey getChurchMusicalKey() {
		return this.churchMusicalKey;
	}

	public void setChurchMusicalKey(ChurchMusicalKey churchMusicalKey) {
		this.churchMusicalKey = churchMusicalKey;
	}

}