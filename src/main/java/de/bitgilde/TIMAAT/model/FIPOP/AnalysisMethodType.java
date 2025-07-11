package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
 * The persistent class for the analysis_method_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="analysis_method_type")
@NamedQuery(name="AnalysisMethodType.findAll", query="SELECT a FROM AnalysisMethodType a")
public class AnalysisMethodType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	@Column(name="is_static", columnDefinition = "BOOLEAN")
	private Boolean isStatic;

	@Column(name="layer_visual", columnDefinition = "BOOLEAN")
	private Boolean layerVisual;

	@Column(name="layer_audio", columnDefinition = "BOOLEAN")
	private Boolean layerAudio;

	//bi-directional many-to-one association to AnalysisMethod
	@OneToMany(mappedBy="analysisMethodType")
	@JsonIgnore
	private List<AnalysisMethod> analysisMethods;

	//bi-directional many-to-one association to AnalysisMethodTypeTranslation
	@OneToMany(mappedBy="analysisMethodType")
	private List<AnalysisMethodTypeTranslation> analysisMethodTypeTranslations;

	public AnalysisMethodType() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Boolean getIsStatic() {
		return this.isStatic;
	}

	public void setIsStatic(Boolean isStatic) {
		this.isStatic = isStatic;
	}

	public Boolean getLayerVisual() {
		return this.layerVisual;
	}

	public void setIsVisual(Boolean layerVisual) {
		this.layerVisual = layerVisual;
	}

	public Boolean getLayerAudio() {
		return this.layerAudio;
	}

	public void setIsAudio(Boolean layerAudio) {
		this.layerAudio = layerAudio;
	}

	public List<AnalysisMethod> getAnalysisMethods() {
		return this.analysisMethods;
	}

	public void setAnalysisMethods(List<AnalysisMethod> analysisMethods) {
		this.analysisMethods = analysisMethods;
	}

	public AnalysisMethod addAnalysisMethod(AnalysisMethod analysisMethod) {
		getAnalysisMethods().add(analysisMethod);
		analysisMethod.setAnalysisMethodType(this);

		return analysisMethod;
	}

	public AnalysisMethod removeAnalysisMethod(AnalysisMethod analysisMethod) {
		getAnalysisMethods().remove(analysisMethod);
		analysisMethod.setAnalysisMethodType(null);

		return analysisMethod;
	}

	public List<AnalysisMethodTypeTranslation> getAnalysisMethodTypeTranslations() {
		return this.analysisMethodTypeTranslations;
	}

	public void setAnalysisMethodTypeTranslations(List<AnalysisMethodTypeTranslation> analysisMethodTypeTranslations) {
		this.analysisMethodTypeTranslations = analysisMethodTypeTranslations;
	}

	public AnalysisMethodTypeTranslation addAnalysisMethodTypeTranslation(AnalysisMethodTypeTranslation analysisMethodTypeTranslation) {
		getAnalysisMethodTypeTranslations().add(analysisMethodTypeTranslation);
		analysisMethodTypeTranslation.setAnalysisMethodType(this);

		return analysisMethodTypeTranslation;
	}

	public AnalysisMethodTypeTranslation removeAnalysisMethodTypeTranslation(AnalysisMethodTypeTranslation analysisMethodTypeTranslation) {
		getAnalysisMethodTypeTranslations().remove(analysisMethodTypeTranslation);
		analysisMethodTypeTranslation.setAnalysisMethodType(null);

		return analysisMethodTypeTranslation;
	}

}