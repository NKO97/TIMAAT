package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the light_modifier_translation database table.
 * 
 */
@Entity
@Table(name="light_modifier_translation")
@NamedQuery(name="LightModifierTranslation.findAll", query="SELECT l FROM LightModifierTranslation l")
public class LightModifierTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to LightModifier
	@ManyToOne
	@JoinColumn(name="light_modifier_analysis_method_id")
	@JsonIgnore
	private LightModifier lightModifier;

	public LightModifierTranslation() {
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

	public LightModifier getLightModifier() {
		return this.lightModifier;
	}

	public void setLightModifier(LightModifier lightModifier) {
		this.lightModifier = lightModifier;
	}

}