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
 * The persistent class for the camera_movement_characteristic database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_movement_characteristic")
@NamedQuery(name="CameraMovementCharacteristic.findAll", query="SELECT cmc FROM CameraMovementCharacteristic cmc")
public class CameraMovementCharacteristic implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraMovementCharacteristic is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraMovementCharacteristicTranslation
	@OneToMany(mappedBy="cameraMovementCharacteristic")
	private List<CameraMovementCharacteristicTranslation> cameraMovementCharacteristicTranslations;

	public CameraMovementCharacteristic() {
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

	public List<CameraMovementCharacteristicTranslation> getCameraMovementCharacteristicTranslations() {
		return this.cameraMovementCharacteristicTranslations;
	}

	public void setCameraMovementCharacteristicTranslations(List<CameraMovementCharacteristicTranslation> cameraMovementCharacteristicTranslations) {
		this.cameraMovementCharacteristicTranslations = cameraMovementCharacteristicTranslations;
	}

	public CameraMovementCharacteristicTranslation addCameraMovementCharacteristicTranslation(CameraMovementCharacteristicTranslation cameraMovementCharacteristicTranslation) {
		getCameraMovementCharacteristicTranslations().add(cameraMovementCharacteristicTranslation);
		cameraMovementCharacteristicTranslation.setCameraMovementCharacteristic(this);

		return cameraMovementCharacteristicTranslation;
	}

	public CameraMovementCharacteristicTranslation removeCameraMovementCharacteristicTranslation(CameraMovementCharacteristicTranslation cameraMovementCharacteristicTranslation) {
		getCameraMovementCharacteristicTranslations().remove(cameraMovementCharacteristicTranslation);
		cameraMovementCharacteristicTranslation.setCameraMovementCharacteristic(null);

		return cameraMovementCharacteristicTranslation;
	}

}