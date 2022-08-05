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


/**
 * The persistent class for the camera_vertical_angle database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_vertical_angle")
@NamedQuery(name="CameraVerticalAngle.findAll", query="SELECT c FROM CameraVerticalAngle c")
public class CameraVerticalAngle implements Serializable {
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
	@JsonIgnore // CameraVerticalAngle is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraVerticalAngleTranslation
	@OneToMany(mappedBy="cameraVerticalAngle")
	private List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslations;

	// //bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraVerticalAngle")
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraVerticalAngle() {
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

	public List<CameraVerticalAngleTranslation> getCameraVerticalAngleTranslations() {
		return this.cameraVerticalAngleTranslations;
	}

	public void setCameraVerticalAngleTranslations(List<CameraVerticalAngleTranslation> cameraVerticalAngleTranslations) {
		this.cameraVerticalAngleTranslations = cameraVerticalAngleTranslations;
	}

	public CameraVerticalAngleTranslation addCameraVerticalAngleTranslation(CameraVerticalAngleTranslation cameraVerticalAngleTranslation) {
		getCameraVerticalAngleTranslations().add(cameraVerticalAngleTranslation);
		cameraVerticalAngleTranslation.setCameraVerticalAngle(this);

		return cameraVerticalAngleTranslation;
	}

	public CameraVerticalAngleTranslation removeCameraVerticalAngleTranslation(CameraVerticalAngleTranslation cameraVerticalAngleTranslation) {
		getCameraVerticalAngleTranslations().remove(cameraVerticalAngleTranslation);
		cameraVerticalAngleTranslation.setCameraVerticalAngle(null);

		return cameraVerticalAngleTranslation;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraVerticalAngle(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraVerticalAngle(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}