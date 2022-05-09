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
 * The persistent class for the camera_movement_characteristic_translation database table.
 *
 */
@Entity
@Table(name="camera_movement_characteristic_translation")
@NamedQuery(name="CameraMovementCharacteristicTranslation.findAll", query="SELECT c FROM CameraMovementCharacteristicTranslation c")
public class CameraMovementCharacteristicTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to CameraMovementCharacteristic
	@ManyToOne
	@JoinColumn(name="camera_movement_characteristic_analysis_method_id")
	@JsonIgnore
	private CameraMovementCharacteristic cameraMovementCharacteristic;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public CameraMovementCharacteristicTranslation() {
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

	public CameraMovementCharacteristic getCameraMovementCharacteristic() {
		return this.cameraMovementCharacteristic;
	}

	public void setCameraMovementCharacteristic(CameraMovementCharacteristic cameraMovementCharacteristic) {
		this.cameraMovementCharacteristic = cameraMovementCharacteristic;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}