package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


/**
 * The persistent class for the gestural_emotion_intensity_translation database table.
 * 
 */
@Entity
@Table(name="gestural_emotion_intensity_translation")
@NamedQuery(name="GesturalEmotionIntensityTranslation.findAll", query="SELECT g FROM GesturalEmotionIntensityTranslation g")
public class GesturalEmotionIntensityTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to GesturalEmotionIntensity
	@ManyToOne
	@JoinColumn(name="gestural_emotion_intensity_analysis_method_id")
	@JsonIgnore
	private GesturalEmotionIntensity gesturalEmotionIntensity;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public GesturalEmotionIntensityTranslation() {
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

	public GesturalEmotionIntensity getGesturalEmotionIntensity() {
		return this.gesturalEmotionIntensity;
	}

	public void setGesturalEmotionIntensity(GesturalEmotionIntensity gesturalEmotionIntensity) {
		this.gesturalEmotionIntensity = gesturalEmotionIntensity;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}