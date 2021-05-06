package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the camera_movement database table.
 * 
 */
@Entity
@Table(name="camera_movement")
@NamedQuery(name="CameraMovement.findAll", query="SELECT cm FROM CameraMovement cm")
public class CameraMovement implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@Column(name="analysis_method_id")
	private int analysisMethodId;

	//bi-directional one-to-one association to AnalysisMethod
	@OneToOne
	@PrimaryKeyJoinColumn(name="analysis_method_id")
	@JsonIgnore // CameraMovement is accessed through AnalysisMethod --> avoid reference cycle
	private AnalysisMethod analysisMethod;

	//bi-directional many-to-one association to CameraMovementType
	@OneToOne
	@JoinColumn(name="camera_movement_type_analysis_method_id")
	private CameraMovementType cameraMovementType;

	//bi-directional many-to-one association to CameraMovementCharacteristic
	@OneToOne
	@JoinColumn(name="camera_movement_characteristic_analysis_method_id")
	private CameraMovementCharacteristic cameraMovementCharacteristic;

	//bi-directional many-to-one association to ConceptDirection
	@OneToOne
	@JoinColumn(name="concept_direction_analysis_method_id")
	private ConceptDirection conceptDirection;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	@OneToOne
	@JoinColumn(name="start_concept_camera_position_and_perspective_analysis_method_id")
	private ConceptCameraPositionAndPerspective startConceptCameraPositionAndPerspective;

	//bi-directional many-to-one association to ConceptCameraPositionAndPerspective
	@OneToOne
	@JoinColumn(name="end_concept_camera_position_and_perspective_analysis_method_id")
	private ConceptCameraPositionAndPerspective endConceptCameraPositionAndPerspective;

	public CameraMovement() {
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

	public CameraMovementType getCameraMovementType() 
	{
		return this.cameraMovementType;
	}

	public void setCameraMovementType(CameraMovementType cameraMovementType) {
		this.cameraMovementType = cameraMovementType;
	}

	public CameraMovementCharacteristic getCameraMovementCharacteristic() 
	{
		return this.cameraMovementCharacteristic;
	}

	public void setCameraMovementCharacteristic(CameraMovementCharacteristic cameraMovementCharacteristic) {
		this.cameraMovementCharacteristic = cameraMovementCharacteristic;
	}

	public ConceptDirection getConceptDirection() {
		return this.conceptDirection;
	}

	public void setConceptDirection(ConceptDirection conceptDirection) {
		this.conceptDirection = conceptDirection;
	}

	public ConceptCameraPositionAndPerspective getStartConceptCameraPositionAndPerspective() {
		return this.startConceptCameraPositionAndPerspective;
	}

	public void setStartConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
		this.startConceptCameraPositionAndPerspective = conceptCameraPositionAndPerspective;
	}

	public ConceptCameraPositionAndPerspective getEndConceptCameraPositionAndPerspective() {
		return this.endConceptCameraPositionAndPerspective;
	}

	public void setEndConceptCameraPositionAndPerspective(ConceptCameraPositionAndPerspective conceptCameraPositionAndPerspective) {
		this.endConceptCameraPositionAndPerspective = conceptCameraPositionAndPerspective;
	}
}