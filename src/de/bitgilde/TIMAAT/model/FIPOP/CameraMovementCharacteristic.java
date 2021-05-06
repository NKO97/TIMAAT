package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the camera_movement_characteristic database table.
 * 
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