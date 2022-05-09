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
 * The persistent class for the audio_post_production_translation database table.
 *
 */
@Entity
@Table(name="audio_post_production_translation")
@NamedQuery(name="AudioPostProductionTranslation.findAll", query="SELECT a FROM AudioPostProductionTranslation a")
public class AudioPostProductionTranslation implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String bass;

	private String delay;

	private String overdubbing;

	private String panning;

	private String reverb;

	private String treble;

	//bi-directional many-to-one association to AudioPostProduction
	@ManyToOne
	@JoinColumn(name="audio_post_production_id")
	@JsonIgnore
	private AudioPostProduction audioPostProduction;

	//bi-directional many-to-one association to Language
	@ManyToOne
	private Language language;

	public AudioPostProductionTranslation() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getBass() {
		return this.bass;
	}

	public void setBass(String bass) {
		this.bass = bass;
	}

	public String getDelay() {
		return this.delay;
	}

	public void setDelay(String delay) {
		this.delay = delay;
	}

	public String getOverdubbing() {
		return this.overdubbing;
	}

	public void setOverdubbing(String overdubbing) {
		this.overdubbing = overdubbing;
	}

	public String getPanning() {
		return this.panning;
	}

	public void setPanning(String panning) {
		this.panning = panning;
	}

	public String getReverb() {
		return this.reverb;
	}

	public void setReverb(String reverb) {
		this.reverb = reverb;
	}

	public String getTreble() {
		return this.treble;
	}

	public void setTreble(String treble) {
		this.treble = treble;
	}

	public AudioPostProduction getAudioPostProduction() {
		return this.audioPostProduction;
	}

	public void setAudioPostProduction(AudioPostProduction audioPostProduction) {
		this.audioPostProduction = audioPostProduction;
	}

	public Language getLanguage() {
		return this.language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

}