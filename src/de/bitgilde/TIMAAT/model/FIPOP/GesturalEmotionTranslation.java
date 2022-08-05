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
 * The persistent class for the gestural_emotion_translation database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
 */
@Entity
@Table(name="gestural_emotion_translation")
@NamedQuery(name="GesturalEmotionTranslation.findAll", query="SELECT g FROM GesturalEmotionTranslation g")
public class GesturalEmotionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String name;

	//bi-directional many-to-one association to GesturalEmotion
	@ManyToOne
	@JoinColumn(name="gestural_emotion_analysis_method_id")
	@JsonIgnore
	private GesturalEmotion gesturalEmotion;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public GesturalEmotionTranslation() {
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

	public GesturalEmotion getGesturalEmotion() {
		return this.gesturalEmotion;
	}

	public void setGesturalEmotion(GesturalEmotion gesturalEmotion) {
		this.gesturalEmotion = gesturalEmotion;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}