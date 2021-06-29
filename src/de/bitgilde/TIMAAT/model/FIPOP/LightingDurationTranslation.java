package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the lighting_duration_translation database table.
 * 
 */
@Entity
@Table(name="lighting_duration_translation")
@NamedQuery(name="LightingDurationTranslation.findAll", query="SELECT l FROM LightingDurationTranslation l")
public class LightingDurationTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to LightingDuration
	@ManyToOne
	@JoinColumn(name="lighting_duration_analysis_method_id")
	@JsonIgnore
	private LightingDuration lightingDuration;

	public LightingDurationTranslation() {
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

	public LightingDuration getLightingDuration() {
		return this.lightingDuration;
	}

	public void setLightingDuration(LightingDuration lightingDuration) {
		this.lightingDuration = lightingDuration;
	}

}