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
 * The persistent class for the camera_axis_of_action database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_axis_of_action")
@NamedQuery(name="CameraAxisOfAction.findAll", query="SELECT c FROM CameraAxisOfAction c")
public class CameraAxisOfAction implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	@Column(name="max_angle")
	private String maxAngle;

	@Column(name="min_angle")
	private String minAngle;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraAxisOfAction is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraAxisOfActionTranslation
	@OneToMany(mappedBy="cameraAxisOfAction")
	private List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslations;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	// @OneToMany(mappedBy="cameraAxisOfAction")
	// @JsonIgnore
	// private List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives;

	public CameraAxisOfAction() {
	}

	public int getAnalysisMethodId() {
		return this.analysisMethodId;
	}

	public void setAnalysisMethodId(int analysisMethodId) {
		this.analysisMethodId = analysisMethodId;
	}

	public String getMaxAngle() {
		return this.maxAngle;
	}

	public void setMaxAngle(String maxAngle) {
		this.maxAngle = maxAngle;
	}

	public String getMinAngle() {
		return this.minAngle;
	}

	public void setMinAngle(String minAngle) {
		this.minAngle = minAngle;
	}

	public AnalysisMethod getAnalysisMethod() {
		return this.analysisMethod;
	}

	public void setAnalysisMethod(AnalysisMethod analysisMethod) {
		this.analysisMethod = analysisMethod;
	}

	public List<CameraAxisOfActionTranslation> getCameraAxisOfActionTranslations() {
		return this.cameraAxisOfActionTranslations;
	}

	public void setCameraAxisOfActionTranslations(List<CameraAxisOfActionTranslation> cameraAxisOfActionTranslations) {
		this.cameraAxisOfActionTranslations = cameraAxisOfActionTranslations;
	}

	public CameraAxisOfActionTranslation addCameraAxisOfActionTranslation(CameraAxisOfActionTranslation cameraAxisOfActionTranslation) {
		getCameraAxisOfActionTranslations().add(cameraAxisOfActionTranslation);
		cameraAxisOfActionTranslation.setCameraAxisOfAction(this);

		return cameraAxisOfActionTranslation;
	}

	public CameraAxisOfActionTranslation removeCameraAxisOfActionTranslation(CameraAxisOfActionTranslation cameraAxisOfActionTranslation) {
		getCameraAxisOfActionTranslations().remove(cameraAxisOfActionTranslation);
		cameraAxisOfActionTranslation.setCameraAxisOfAction(null);

		return cameraAxisOfActionTranslation;
	}

	// public List<ConceptCameraPositionAndPerspective> getConceptCameraPositionAndPerspectives() {
	// 	return this.conceptCameraPositionAndPerspectives;
	// }

	// public void setConceptCameraPositionAndPerspectives(List<ConceptCameraPositionAndPerspective> conceptCameraPositionAndPerspectives) {
	// 	this.conceptCameraPositionAndPerspectives = conceptCameraPositionAndPerspectives;
	// }

	// public ConceptCameraPositionAndPerspective addConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().add(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraAxisOfAction(this);

	// 	return conceptCameraPositionAndPerspective;
	// }

	// public ConceptCameraPositionAndPerspective removeConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
	// 	getConceptCameraPositionAndPerspectives().remove(conceptCameraPositionAndPerspective);
	// 	conceptCameraPositionAndPerspective.setCameraAxisOfAction(null);

	// 	return conceptCameraPositionAndPerspective;
	// }

}