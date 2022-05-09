package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;


/**
 * The persistent class for the camera_depth_of_focus_translation database table.
 *
 */
@Entity
@Table(name="camera_depth_of_focus_translation")
@NamedQuery(name="CameraDepthOfFocusTranslation.findAll", query="SELECT c FROM CameraDepthOfFocusTranslation c")
public class CameraDepthOfFocusTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to CameraDepthOfFocus
	@ManyToOne
	@JoinColumn(name="camera_depth_of_focus_analysis_method_id")
	@JsonIgnore
	private CameraDepthOfFocus cameraDepthOfFocus;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraDepthOfFocusTranslation() {
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

	public CameraDepthOfFocus getCameraDepthOfFocus() {
		return this.cameraDepthOfFocus;
	}

	public void setCameraDepthOfFocus(CameraDepthOfFocus cameraDepthOfFocus) {
		this.cameraDepthOfFocus = cameraDepthOfFocus;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}