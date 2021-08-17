package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the light_position_translation database table.
 * 
 */
@Entity
@Table(name="light_position_translation")
@NamedQuery(name="LightPositionTranslation.findAll", query="SELECT l FROM LightPositionTranslation l")
public class LightPositionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to LightPosition
	@ManyToOne
	@JoinColumn(name="light_position_analysis_method_id")
	@JsonIgnore
	private LightPosition lightPosition;

	public LightPositionTranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public LightPosition getLightPosition() {
		return this.lightPosition;
	}

	public void setLightPosition(LightPosition lightPosition) {
		this.lightPosition = lightPosition;
	}

}