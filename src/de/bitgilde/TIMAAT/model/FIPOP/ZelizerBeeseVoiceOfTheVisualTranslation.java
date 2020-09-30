package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;


/**
 * The persistent class for the zelizer_beese_voice_of_the_visual_translation database table.
 * 
 */
@Entity
@Table(name="zelizer_beese_voice_of_the_visual_translation")
@NamedQuery(name="ZelizerBeeseVoiceOfTheVisualTranslation.findAll", query="SELECT z FROM ZelizerBeeseVoiceOfTheVisualTranslation z")
public class ZelizerBeeseVoiceOfTheVisualTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String type;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	//bi-directional many-to-one association to ZelizerBeeseVoiceOfTheVisual
	@ManyToOne
	@JoinColumn(name="zelizer_beese_voice_of_the_visual_analysis_method_id")
	@JsonIgnore
	private ZelizerBeeseVoiceOfTheVisual zelizerBeeseVoiceOfTheVisual;

	public ZelizerBeeseVoiceOfTheVisualTranslation() {
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

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public ZelizerBeeseVoiceOfTheVisual getZelizerBeeseVoiceOfTheVisual() {
		return this.zelizerBeeseVoiceOfTheVisual;
	}

	public void setZelizerBeeseVoiceOfTheVisual(ZelizerBeeseVoiceOfTheVisual zelizerBeeseVoiceOfTheVisual) {
		this.zelizerBeeseVoiceOfTheVisual = zelizerBeeseVoiceOfTheVisual;
	}

}