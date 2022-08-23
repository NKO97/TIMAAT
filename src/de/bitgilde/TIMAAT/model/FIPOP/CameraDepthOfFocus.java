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
 * The persistent class for the camera_depth_of_focus database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_depth_of_focus")
@NamedQuery(name="CameraDepthOfFocus.findAll", query="SELECT c FROM CameraDepthOfFocus c")
public class CameraDepthOfFocus implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraDepthOfFocus is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraDepthOfFocusTranslation
	@OneToMany(mappedBy="cameraDepthOfFocus")
	private List<CameraDepthOfFocusTranslation> cameraDepthOfFocusTranslations;

	//bi-directional many-to-one association to ConceptCameraMovementAndHandling
	// @OneToMany(mappedBy="cameraDepthOfFocus")
	// private List<ConceptCameraMovementAndHandling> conceptCameraMovementAndHandlings;

	public CameraDepthOfFocus() {
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

	public List<CameraDepthOfFocusTranslation> getCameraDepthOfFocusTranslations() {
		return this.cameraDepthOfFocusTranslations;
	}

	public void setCameraDepthOfFocusTranslations(List<CameraDepthOfFocusTranslation> cameraDepthOfFocusTranslations) {
		this.cameraDepthOfFocusTranslations = cameraDepthOfFocusTranslations;
	}

	public CameraDepthOfFocusTranslation addCameraDepthOfFocusTranslation(CameraDepthOfFocusTranslation cameraDepthOfFocusTranslation) {
		getCameraDepthOfFocusTranslations().add(cameraDepthOfFocusTranslation);
		cameraDepthOfFocusTranslation.setCameraDepthOfFocus(this);

		return cameraDepthOfFocusTranslation;
	}

	public CameraDepthOfFocusTranslation removeCameraDepthOfFocusTranslation(CameraDepthOfFocusTranslation cameraDepthOfFocusTranslation) {
		getCameraDepthOfFocusTranslations().remove(cameraDepthOfFocusTranslation);
		cameraDepthOfFocusTranslation.setCameraDepthOfFocus(null);

		return cameraDepthOfFocusTranslation;
	}

	// public List<ConceptCameraMovementAndHandling> getConceptCameraMovementAndHandlings() {
	// 	return this.conceptCameraMovementAndHandlings;
	// }

	// public void setConceptCameraMovementAndHandlings(List<ConceptCameraMovementAndHandling> conceptCameraMovementAndHandlings) {
	// 	this.conceptCameraMovementAndHandlings = conceptCameraMovementAndHandlings;
	// }

	// public ConceptCameraMovementAndHandling addConceptCameraMovementAndHandling(ConceptCameraMovementAndHandling conceptCameraMovementAndHandling) {
	// 	getConceptCameraMovementAndHandlings().add(conceptCameraMovementAndHandling);
	// 	conceptCameraMovementAndHandling.setCameraDepthOfFocus(this);

	// 	return conceptCameraMovementAndHandling;
	// }

	// public ConceptCameraMovementAndHandling removeConceptCameraMovementAndHandling(ConceptCameraMovementAndHandling conceptCameraMovementAndHandling) {
	// 	getConceptCameraMovementAndHandlings().remove(conceptCameraMovementAndHandling);
	// 	conceptCameraMovementAndHandling.setCameraDepthOfFocus(null);

	// 	return conceptCameraMovementAndHandling;
	// }

}