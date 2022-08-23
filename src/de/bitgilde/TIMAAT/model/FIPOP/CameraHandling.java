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
 * The persistent class for the camera_handling database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_handling")
@NamedQuery(name="CameraHandling.findAll", query="SELECT c FROM CameraHandling c")
public class CameraHandling implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraHandling is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraHandlingTranslation
	@OneToMany(mappedBy="cameraHandling")
	private List<CameraHandlingTranslation> cameraHandlingTranslations;

	//bi-directional many-to-one association to ConceptCameraMovementAndHandling
	// @OneToMany(mappedBy="cameraHandling")
	// private List<ConceptCameraMovementAndHandling> conceptCameraMovementAndHandlings;

	public CameraHandling() {
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

	public List<CameraHandlingTranslation> getCameraHandlingTranslations() {
		return this.cameraHandlingTranslations;
	}

	public void setCameraHandlingTranslations(List<CameraHandlingTranslation> cameraHandlingTranslations) {
		this.cameraHandlingTranslations = cameraHandlingTranslations;
	}

	public CameraHandlingTranslation addCameraHandlingTranslation(CameraHandlingTranslation cameraHandlingTranslation) {
		getCameraHandlingTranslations().add(cameraHandlingTranslation);
		cameraHandlingTranslation.setCameraHandling(this);

		return cameraHandlingTranslation;
	}

	public CameraHandlingTranslation removeCameraHandlingTranslation(CameraHandlingTranslation cameraHandlingTranslation) {
		getCameraHandlingTranslations().remove(cameraHandlingTranslation);
		cameraHandlingTranslation.setCameraHandling(null);

		return cameraHandlingTranslation;
	}

	// public List<ConceptCameraMovementAndHandling> getConceptCameraMovementAndHandlings() {
	// 	return this.conceptCameraMovementAndHandlings;
	// }

	// public void setConceptCameraMovementAndHandlings(List<ConceptCameraMovementAndHandling> conceptCameraMovementAndHandlings) {
	// 	this.conceptCameraMovementAndHandlings = conceptCameraMovementAndHandlings;
	// }

	// public ConceptCameraMovementAndHandling addConceptCameraMovementAndHandling(ConceptCameraMovementAndHandling conceptCameraMovementAndHandling) {
	// 	getConceptCameraMovementAndHandlings().add(conceptCameraMovementAndHandling);
	// 	conceptCameraMovementAndHandling.setCameraHandling(this);

	// 	return conceptCameraMovementAndHandling;
	// }

	// public ConceptCameraMovementAndHandling removeConceptCameraMovementAndHandling(ConceptCameraMovementAndHandling conceptCameraMovementAndHandling) {
	// 	getConceptCameraMovementAndHandlings().remove(conceptCameraMovementAndHandling);
	// 	conceptCameraMovementAndHandling.setCameraHandling(null);

	// 	return conceptCameraMovementAndHandling;
	// }

}