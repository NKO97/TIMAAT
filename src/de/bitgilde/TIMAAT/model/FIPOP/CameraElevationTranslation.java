package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the camera_elevation_translation database table.
 * 
 */
@Entity
@Table(name="camera_elevation_translation")
@NamedQuery(name="CameraElevationTranslation.findAll", query="SELECT c FROM CameraElevationTranslation c")
public class CameraElevationTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to CameraElevation
	@ManyToOne
	@JoinColumn(name="camera_elevation_analysis_method_id")
	@JsonIgnore
	private CameraElevation cameraElevation;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraElevationTranslation() {
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

	public CameraElevation getCameraElevation() {
		return this.cameraElevation;
	}

	public void setCameraElevation(CameraElevation cameraElevation) {
		this.cameraElevation = cameraElevation;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}