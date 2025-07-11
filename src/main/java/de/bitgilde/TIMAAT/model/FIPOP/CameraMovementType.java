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
 * The persistent class for the camera_movement database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_movement_type")
@NamedQuery(name="CameraMovementType.findAll", query="SELECT cmt FROM CameraMovementType cmt")
public class CameraMovementType implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraMovement is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraMovementTypeTranslation
	@OneToMany(mappedBy="cameraMovementType")
	private List<CameraMovementTypeTranslation> cameraMovementTypeTranslations;

	public CameraMovementType() {
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

	public List<CameraMovementTypeTranslation> getCameraMovementTypeTranslations() {
		return this.cameraMovementTypeTranslations;
	}

	public void setCameraMovementTypeTranslations(List<CameraMovementTypeTranslation> cameraMovementTypeTranslations) {
		this.cameraMovementTypeTranslations = cameraMovementTypeTranslations;
	}

	public CameraMovementTypeTranslation addCameraMovementTypeTranslation(CameraMovementTypeTranslation cameraMovementTypeTranslation) {
		getCameraMovementTypeTranslations().add(cameraMovementTypeTranslation);
		cameraMovementTypeTranslation.setCameraMovementType(this);

		return cameraMovementTypeTranslation;
	}

	public CameraMovementTypeTranslation removeCameraMovementTypeTranslation(CameraMovementTypeTranslation cameraMovementTypeTranslation) {
		getCameraMovementTypeTranslations().remove(cameraMovementTypeTranslation);
		cameraMovementTypeTranslation.setCameraMovementType(null);

		return cameraMovementTypeTranslation;
	}

}