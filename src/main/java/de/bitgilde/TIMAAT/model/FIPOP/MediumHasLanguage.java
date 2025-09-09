package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
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
 * The persistent class for the medium_has_language database table.
 *
 * @author Jens-Martin Loebel <loebel@bitgilde.de>
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="medium_has_language")
@NamedQuery(name="MediumHasLanguage.findAll", query="SELECT m FROM MediumHasLanguage m")
public class MediumHasLanguage implements Serializable {
	private static final long serialVersionUID = 1L;

	@EmbeddedId
	private MediumHasLanguagePK id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to Medium
	@ManyToOne
	@JoinColumn(name="medium_id")
	@JsonIgnore
	private Medium medium;

	//bi-directional many-to-one association to MediumLanguageType
	@ManyToOne
	@JoinColumn(name="medium_language_type_id")
	private MediumLanguageType mediumLanguageType;

	public MediumHasLanguage() {
	}

	public MediumHasLanguagePK getId() {
		return this.id;
	}

	public void setId(MediumHasLanguagePK id) {
		this.id = id;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Medium getMedium() {
		return this.medium;
	}

	public void setMedium(Medium medium) {
		this.medium = medium;
	}

	public MediumLanguageType getMediumLanguageType() {
		return this.mediumLanguageType;
	}

	public void setMediumLanguageType(MediumLanguageType mediumLanguageType) {
		this.mediumLanguageType = mediumLanguageType;
	}

}