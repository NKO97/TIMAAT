package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrimaryKeyJoinColumn;
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
 * The persistent class for the light_modifier database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="light_modifier")
@NamedQuery(name="LightModifier.findAll", query="SELECT l FROM LightModifier l")
public class LightModifier implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // LightingModifier is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to LightModifierTranslation
	@OneToMany(mappedBy="lightModifier")
	private List<LightModifierTranslation> lightModifierTranslations;

	public LightModifier() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<LightModifierTranslation> getLightModifierTranslations() {
		return this.lightModifierTranslations;
	}

	public void setLightModifierTranslations(List<LightModifierTranslation> lightModifierTranslations) {
		this.lightModifierTranslations = lightModifierTranslations;
	}

	public LightModifierTranslation addLightModifierTranslation(LightModifierTranslation lightModifierTranslation) {
		getLightModifierTranslations().add(lightModifierTranslation);
		lightModifierTranslation.setLightModifier(this);

		return lightModifierTranslation;
	}

	public LightModifierTranslation removeLightModifierTranslation(LightModifierTranslation lightModifierTranslation) {
		getLightModifierTranslations().remove(lightModifierTranslation);
		lightModifierTranslation.setLightModifier(null);

		return lightModifierTranslation;
	}

}