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
 * The persistent class for the camera_axis_of_action_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="camera_axis_of_action_translation")
@NamedQuery(name="CameraAxisOfActionTranslation.findAll", query="SELECT c FROM CameraAxisOfActionTranslation c")
public class CameraAxisOfActionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to CameraAxisOfAction
	@ManyToOne
	@JoinColumn(name="camera_axis_of_action_analysis_method_id")
	@JsonIgnore
	private CameraAxisOfAction cameraAxisOfAction;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraAxisOfActionTranslation() {
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

	public CameraAxisOfAction getCameraAxisOfAction() {
		return this.cameraAxisOfAction;
	}

	public void setCameraAxisOfAction(CameraAxisOfAction cameraAxisOfAction) {
		this.cameraAxisOfAction = cameraAxisOfAction;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}