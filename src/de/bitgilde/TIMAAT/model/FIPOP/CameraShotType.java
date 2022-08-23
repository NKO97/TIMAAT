package de.bitgilde.TIMAAT.model.FIPOP;


import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
 * The persistent class for the camera_shot_type database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_shot_type")
@NamedQuery(name="CameraShotType.findAll", query="SELECT c FROM CameraShotType c")
public class CameraShotType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraShotType is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraDistance
	@ManyToOne
	@JoinColumn(name="camera_distance_analysis_method_id")
	@JsonBackReference(value="CameraDistance-CameraShotType")
	private CameraDistance cameraDistance;

	//bi-directional many-to-one association to CameraShotTypeTranslation
	@OneToMany(mappedBy="cameraShotType")
	private List<CameraShotTypeTranslation> cameraShotTypeTranslations;

	// //bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraShotType")
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraShotType() {
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

	public CameraDistance getCameraDistance() {
		return this.cameraDistance;
	}

	public void setCameraDistance(CameraDistance cameraDistance) {
		this.cameraDistance = cameraDistance;
	}

	public List<CameraShotTypeTranslation> getCameraShotTypeTranslations() {
		return this.cameraShotTypeTranslations;
	}

	public void setCameraShotTypeTranslations(List<CameraShotTypeTranslation> cameraShotTypeTranslations) {
		this.cameraShotTypeTranslations = cameraShotTypeTranslations;
	}

	public CameraShotTypeTranslation addCameraShotTypeTranslation(CameraShotTypeTranslation cameraShotTypeTranslation) {
		getCameraShotTypeTranslations().add(cameraShotTypeTranslation);
		cameraShotTypeTranslation.setCameraShotType(this);

		return cameraShotTypeTranslation;
	}

	public CameraShotTypeTranslation removeCameraShotTypeTranslation(CameraShotTypeTranslation cameraShotTypeTranslation) {
		getCameraShotTypeTranslations().remove(cameraShotTypeTranslation);
		cameraShotTypeTranslation.setCameraShotType(null);

		return cameraShotTypeTranslation;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraShotType(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraShotType(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}