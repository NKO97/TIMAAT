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
 * The persistent class for the gestural_emotion_intensity database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="gestural_emotion_intensity")
@NamedQuery(name="GesturalEmotionIntensity.findAll", query="SELECT g FROM GesturalEmotionIntensity g")
public class GesturalEmotionIntensity implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	private byte value;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // GesturalEmotionIntensity is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to GesturalEmotionIntensityTranslation
	@OneToMany(mappedBy="gesturalEmotionIntensity")
	private List<GesturalEmotionIntensityTranslation> gesturalEmotionIntensityTranslations;

	public GesturalEmotionIntensity() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public byte getValue() {
		return this.value;
	}

	public void setValue(byte value) {
		this.value = value;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<GesturalEmotionIntensityTranslation> getGesturalEmotionIntensityTranslations() {
		return this.gesturalEmotionIntensityTranslations;
	}

	public void setGesturalEmotionIntensityTranslations(List<GesturalEmotionIntensityTranslation> gesturalEmotionIntensityTranslations) {
		this.gesturalEmotionIntensityTranslations = gesturalEmotionIntensityTranslations;
	}

	public GesturalEmotionIntensityTranslation addGesturalEmotionIntensityTranslation(GesturalEmotionIntensityTranslation gesturalEmotionIntensityTranslation) {
		getGesturalEmotionIntensityTranslations().add(gesturalEmotionIntensityTranslation);
		gesturalEmotionIntensityTranslation.setGesturalEmotionIntensity(this);

		return gesturalEmotionIntensityTranslation;
	}

	public GesturalEmotionIntensityTranslation removeGesturalEmotionIntensityTranslation(GesturalEmotionIntensityTranslation gesturalEmotionIntensityTranslation) {
		getGesturalEmotionIntensityTranslations().remove(gesturalEmotionIntensityTranslation);
		gesturalEmotionIntensityTranslation.setGesturalEmotionIntensity(null);

		return gesturalEmotionIntensityTranslation;
	}

}