package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the camera_horizontal_angle database table.
 * 
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