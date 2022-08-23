package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the medium_language_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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