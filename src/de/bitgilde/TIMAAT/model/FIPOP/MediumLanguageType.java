package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.Set;


/**
 * The persistent class for the medium_language_type database table.
 * 
 */
@Entity
@Table(name="medium_language_type")
@NamedQuery(name="MediumLanguageType.findAll", query="SELECT m FROM MediumLanguageType m")
public class MediumLanguageType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private int id;

	//bi-directional many-to-one association to MediumHasLanguage
	@OneToMany(mappedBy="mediumLanguageType")
	@JsonIgnore
	private Set<MediumHasLanguage> mediumHasLanguages;

	//bi-directional many-to-one association to MediumLanguageTypeTranslation
	@OneToMany(mappedBy="mediumLanguageType")
	private Set<MediumLanguageTypeTranslation> mediumLanguageTypeTranslations;

	public MediumLanguageType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Set<MediumHasLanguage> getMediumHasLanguages() {
		return this.mediumHasLanguages;
	}

	public void setMediumHasLanguages(Set<MediumHasLanguage> mediumHasLanguages) {
		this.mediumHasLanguages = mediumHasLanguages;
	}

	public MediumHasLanguage addMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().add(mediumHasLanguage);
		mediumHasLanguage.setMediumLanguageType(this);

		return mediumHasLanguage;
	}

	public MediumHasLanguage removeMediumHasLanguage(MediumHasLanguage mediumHasLanguage) {
		getMediumHasLanguages().remove(mediumHasLanguage);
		mediumHasLanguage.setMediumLanguageType(null);

		return mediumHasLanguage;
	}

	public Set<MediumLanguageTypeTranslation> getMediumLanguageTypeTranslations() {
		return this.mediumLanguageTypeTranslations;
	}

	public void setMediumLanguageTypeTranslations(Set<MediumLanguageTypeTranslation> mediumLanguageTypeTranslations) {
		this.mediumLanguageTypeTranslations = mediumLanguageTypeTranslations;
	}

	public MediumLanguageTypeTranslation addMediumLanguageTypeTranslation(MediumLanguageTypeTranslation mediumLanguageTypeTranslation) {
		getMediumLanguageTypeTranslations().add(mediumLanguageTypeTranslation);
		mediumLanguageTypeTranslation.setMediumLanguageType(this);

		return mediumLanguageTypeTranslation;
	}

	public MediumLanguageTypeTranslation removeMediumLanguageTypeTranslation(MediumLanguageTypeTranslation mediumLanguageTypeTranslation) {
		getMediumLanguageTypeTranslations().remove(mediumLanguageTypeTranslation);
		mediumLanguageTypeTranslation.setMediumLanguageType(null);

		return mediumLanguageTypeTranslation;
	}

}