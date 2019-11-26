package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the medium_language_type_translation database table.
 * 
 */
@Entity
@Table(name="medium_language_type_translation")
@NamedQuery(name="MediumLanguageTypeTranslation.findAll", query="SELECT m FROM MediumLanguageTypeTranslation m")
public class MediumLanguageTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to MediumLanguageType
	@ManyToOne
	@JsonIgnore
	@JoinColumn(name="medium_language_type_id")
	private MediumLanguageType mediumLanguageType;

	public MediumLanguageTypeTranslation() {
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

	public MediumLanguageType getMediumLanguageType() {
		return this.mediumLanguageType;
	}

	public void setMediumLanguageType(MediumLanguageType mediumLanguageType) {
		this.mediumLanguageType = mediumLanguageType;
	}

}