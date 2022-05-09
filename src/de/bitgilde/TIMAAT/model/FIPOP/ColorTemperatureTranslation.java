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
 * The persistent class for the color_temperature_translation database table.
 *
 */
@Entity
@Table(name="color_temperature_translation")
@NamedQuery(name="ColorTemperatureTranslation.findAll", query="SELECT c FROM ColorTemperatureTranslation c")
public class ColorTemperatureTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to ColorTemperature
	@ManyToOne
	@JoinColumn(name="color_temperature_analysis_method_id")
	@JsonIgnore
	private ColorTemperature colorTemperature;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public ColorTemperatureTranslation() {
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

	public ColorTemperature getColorTemperature() {
		return this.colorTemperature;
	}

	public void setColorTemperature(ColorTemperature colorTemperature) {
		this.colorTemperature = colorTemperature;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}