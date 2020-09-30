package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the camera_elevation database table.
 * 
 */
@Entity
@Table(name="camera_elevation")
@NamedQuery(name="CameraElevation.findAll", query="SELECT c FROM CameraElevation c")
public class CameraElevation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraElevation is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraElevationTranslation
	@OneToMany(mappedBy="cameraElevation")
	private List<CameraElevationTranslation> cameraElevationTranslations;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraElevation")
	// @JsonIgnore
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraElevation() {
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

	public List<CameraElevationTranslation> getCameraElevationTranslations() {
		return this.cameraElevationTranslations;
	}

	public void setCameraElevationTranslations(List<CameraElevationTranslation> cameraElevationTranslations) {
		this.cameraElevationTranslations = cameraElevationTranslations;
	}

	public CameraElevationTranslation addCameraElevationTranslation(CameraElevationTranslation cameraElevationTranslation) {
		getCameraElevationTranslations().add(cameraElevationTranslation);
		cameraElevationTranslation.setCameraElevation(this);

		return cameraElevationTranslation;
	}

	public CameraElevationTranslation removeCameraElevationTranslation(CameraElevationTranslation cameraElevationTranslation) {
		getCameraElevationTranslations().remove(cameraElevationTranslation);
		cameraElevationTranslation.setCameraElevation(null);

		return cameraElevationTranslation;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraElevation(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraElevation(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}