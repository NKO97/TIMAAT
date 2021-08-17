package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the camera_vertical_angle_translation database table.
 * 
 */
@Entity
@Table(name="camera_vertical_angle_translation")
@NamedQuery(name="CameraVerticalAngleTranslation.findAll", query="SELECT c FROM CameraVerticalAngleTranslation c")
public class CameraVerticalAngleTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to CameraVerticalAngle
	@ManyToOne
	@JoinColumn(name="camera_vertical_angle_analysis_method_id")
	@JsonIgnore
	private CameraVerticalAngle cameraVerticalAngle;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraVerticalAngleTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public CameraVerticalAngle getCameraVerticalAngle() {
		return this.cameraVerticalAngle;
	}

	public void setCameraVerticalAngle(CameraVerticalAngle cameraVerticalAngle) {
		this.cameraVerticalAngle = cameraVerticalAngle;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}