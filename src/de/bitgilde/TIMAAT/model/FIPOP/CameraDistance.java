package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
 * The persistent class for the camera_distance database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_distance")
@NamedQuery(name="CameraDistance.findAll", query="SELECT c FROM CameraDistance c")
public class CameraDistance implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraDistance is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraDistanceTranslation
	@OneToMany(mappedBy="cameraDistance")
	private List<CameraDistanceTranslation> cameraDistanceTranslations;

	//bi-directional many-to-one association to CameraShotType
	@OneToMany(mappedBy="cameraDistance")
	@JsonManagedReference(value="CameraDistance-CameraShotType")
	private List<CameraShotType> cameraShotTypes;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraDistance")
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraDistance() {
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

	public List<CameraDistanceTranslation> getCameraDistanceTranslations() {
		return this.cameraDistanceTranslations;
	}

	public void setCameraDistanceTranslations(List<CameraDistanceTranslation> cameraDistanceTranslations) {
		this.cameraDistanceTranslations = cameraDistanceTranslations;
	}

	public CameraDistanceTranslation addCameraDistanceTranslation(CameraDistanceTranslation cameraDistanceTranslation) {
		getCameraDistanceTranslations().add(cameraDistanceTranslation);
		cameraDistanceTranslation.setCameraDistance(this);

		return cameraDistanceTranslation;
	}

	public CameraDistanceTranslation removeCameraDistanceTranslation(CameraDistanceTranslation cameraDistanceTranslation) {
		getCameraDistanceTranslations().remove(cameraDistanceTranslation);
		cameraDistanceTranslation.setCameraDistance(null);

		return cameraDistanceTranslation;
	}

	public List<CameraShotType> getCameraShotTypes() {
		return this.cameraShotTypes;
	}

	public void setCameraShotTypes(List<CameraShotType> cameraShotTypes) {
		this.cameraShotTypes = cameraShotTypes;
	}

	public CameraShotType addCameraShotType(CameraShotType cameraShotType) {
		getCameraShotTypes().add(cameraShotType);
		cameraShotType.setCameraDistance(this);

		return cameraShotType;
	}

	public CameraShotType removeCameraShotType(CameraShotType cameraShotType) {
		getCameraShotTypes().remove(cameraShotType);
		cameraShotType.setCameraDistance(null);

		return cameraShotType;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraDistance(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraDistance(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}