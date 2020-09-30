package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the camera_handling_translation database table.
 * 
 */
@Entity
@Table(name="camera_handling_translation")
@NamedQuery(name="CameraHandlingTranslation.findAll", query="SELECT c FROM CameraHandlingTranslation c")
public class CameraHandlingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to CameraHandling
	@ManyToOne
	@JoinColumn(name="camera_handling_analysis_method_id")
	@JsonIgnore
	private CameraHandling cameraHandling;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraHandlingTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public CameraHandling getCameraHandling() {
		return this.cameraHandling;
	}

	public void setCameraHandling(CameraHandling cameraHandling) {
		this.cameraHandling = cameraHandling;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}