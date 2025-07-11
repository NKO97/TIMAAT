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
 * The persistent class for the camera_horizontal_angle database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_horizontal_angle")
@NamedQuery(name="CameraHorizontalAngle.findAll", query="SELECT c FROM CameraHorizontalAngle c")
public class CameraHorizontalAngle implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	@Column(name="max_angle")
	private short maxAngle;

	@Column(name="min_angle")
	private short minAngle;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraHorizontalAngle is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraHorizontalAngleTranslation
	@OneToMany(mappedBy="cameraHorizontalAngle")
	private List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslations;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraHorizontalAngle")
	// @JsonIgnore
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraHorizontalAngle() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public short getMaxAngle() {
		return this.maxAngle;
	}

	public void setMaxAngle(short maxAngle) {
		this.maxAngle = maxAngle;
	}

	public short getMinAngle() {
		return this.minAngle;
	}

	public void setMinAngle(short minAngle) {
		this.minAngle = minAngle;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<CameraHorizontalAngleTranslation> getCameraHorizontalAngleTranslations() {
		return this.cameraHorizontalAngleTranslations;
	}

	public void setCameraHorizontalAngleTranslations(List<CameraHorizontalAngleTranslation> cameraHorizontalAngleTranslations) {
		this.cameraHorizontalAngleTranslations = cameraHorizontalAngleTranslations;
	}

	public CameraHorizontalAngleTranslation addCameraHorizontalAngleTranslation(CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation) {
		getCameraHorizontalAngleTranslations().add(cameraHorizontalAngleTranslation);
		cameraHorizontalAngleTranslation.setCameraHorizontalAngle(this);

		return cameraHorizontalAngleTranslation;
	}

	public CameraHorizontalAngleTranslation removeCameraHorizontalAngleTranslation(CameraHorizontalAngleTranslation cameraHorizontalAngleTranslation) {
		getCameraHorizontalAngleTranslations().remove(cameraHorizontalAngleTranslation);
		cameraHorizontalAngleTranslation.setCameraHorizontalAngle(null);

		return cameraHorizontalAngleTranslation;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraHorizontalAngle(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraHorizontalAngle(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}