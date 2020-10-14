package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the lighting_translation database table.
 * 
 */
@Entity
@Table(name="lighting_translation")
@NamedQuery(name="LightingTranslation.findAll", query="SELECT l FROM LightingTranslation l")
public class LightingTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	private String name;

	//bi-directional many-to-one association to Lighting
	@ManyToOne
	@JoinColumn(name="lighting_analysis_method_id")
	@JsonIgnore
	private Lighting lighting;

	public LightingTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Lighting getLighting() {
		return this.lighting;
	}

	public void setLighting(Lighting lighting) {
		this.lighting = lighting;
	}

}