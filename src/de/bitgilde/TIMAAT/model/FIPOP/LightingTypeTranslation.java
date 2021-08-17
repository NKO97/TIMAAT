package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the lighting_type_translation database table.
 * 
 */
@Entity
@Table(name="lighting_type_translation")
@NamedQuery(name="LightingTypeTranslation.findAll", query="SELECT l FROM LightingTypeTranslation l")
public class LightingTypeTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to LightingType
	@ManyToOne
	@JoinColumn(name="lighting_type_analysis_method_id")
	@JsonIgnore
	private LightingType lightingType;

	public LightingTypeTranslation() {
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

	public LightingType getLightingType() {
		return this.lightingType;
	}

	public void setLightingType(LightingType lightingType) {
		this.lightingType = lightingType;
	}

}