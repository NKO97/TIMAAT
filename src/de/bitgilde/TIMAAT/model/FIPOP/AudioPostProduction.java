package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the audio_post_production database table.
 * 
 */
@Entity
@Table(name="audio_post_production")
@NamedQuery(name="AudioPostProduction.findAll", query="SELECT a FROM AudioPostProduction a")
public class AudioPostProduction implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	// //bi-directional many-to-one association to AnalysisAmbientSoundHasAmbience
	// @OneToMany(mappedBy="audioPostProduction")
	// private List<AnalysisAmbientSoundHasAmbience> analysisAmbientSoundHasAmbiences;

	// //bi-directional many-to-one association to AnalysisAmbientSoundHasNoise
	// @OneToMany(mappedBy="audioPostProduction")
	// private List<AnalysisAmbientSoundHasNoise> analysisAmbientSoundHasNoises;

	// //bi-directional many-to-one association to AnalysisAmbientSoundHasSoundEffect
	// @OneToMany(mappedBy="audioPostProduction")
	// private List<AnalysisAmbientSoundHasSoundEffect> analysisAmbientSoundHasSoundEffects;

	// //bi-directional many-to-one association to AnalysisMusic
	// @OneToMany(mappedBy="audioPostProduction")
	// private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to AnalysisSpeech
	@OneToMany(mappedBy="audioPostProduction")
	@JsonIgnore
	private List<AnalysisSpeech> analysisSpeeches;

	// //bi-directional many-to-one association to AnalysisVoice
	// @OneToMany(mappedBy="audioPostProduction")
	// private List<AnalysisVoice> analysisVoices;

	//bi-directional many-to-one association to AudioPostProductionTranslation
	@OneToMany(mappedBy="audioPostProduction")
	private List<AudioPostProductionTranslation> audioPostProductionTranslations;

	// tables cannot contain identifier id alone, or a query exception is thrown
	@Column(columnDefinition = "BOOLEAN")
	private Boolean dummy;

	public AudioPostProduction() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	// public List<AnalysisAmbientSoundHasAmbience> getAnalysisAmbientSoundHasAmbiences() {
	// 	return this.analysisAmbientSoundHasAmbiences;
	// }

	// public void setAnalysisAmbientSoundHasAmbiences(List<AnalysisAmbientSoundHasAmbience> analysisAmbientSoundHasAmbiences) {
	// 	this.analysisAmbientSoundHasAmbiences = analysisAmbientSoundHasAmbiences;
	// }

	// public AnalysisAmbientSoundHasAmbience addAnalysisAmbientSoundHasAmbience(AnalysisAmbientSoundHasAmbience analysisAmbientSoundHasAmbience) {
	// 	getAnalysisAmbientSoundHasAmbiences().add(analysisAmbientSoundHasAmbience);
	// 	analysisAmbientSoundHasAmbience.setAudioPostProduction(this);

	// 	return analysisAmbientSoundHasAmbience;
	// }

	// public AnalysisAmbientSoundHasAmbience removeAnalysisAmbientSoundHasAmbience(AnalysisAmbientSoundHasAmbience analysisAmbientSoundHasAmbience) {
	// 	getAnalysisAmbientSoundHasAmbiences().remove(analysisAmbientSoundHasAmbience);
	// 	analysisAmbientSoundHasAmbience.setAudioPostProduction(null);

	// 	return analysisAmbientSoundHasAmbience;
	// }

	// public List<AnalysisAmbientSoundHasNoise> getAnalysisAmbientSoundHasNoises() {
	// 	return this.analysisAmbientSoundHasNoises;
	// }

	// public void setAnalysisAmbientSoundHasNoises(List<AnalysisAmbientSoundHasNoise> analysisAmbientSoundHasNoises) {
	// 	this.analysisAmbientSoundHasNoises = analysisAmbientSoundHasNoises;
	// }

	// public AnalysisAmbientSoundHasNoise addAnalysisAmbientSoundHasNois(AnalysisAmbientSoundHasNoise analysisAmbientSoundHasNois) {
	// 	getAnalysisAmbientSoundHasNoises().add(analysisAmbientSoundHasNois);
	// 	analysisAmbientSoundHasNois.setAudioPostProduction(this);

	// 	return analysisAmbientSoundHasNois;
	// }

	// public AnalysisAmbientSoundHasNoise removeAnalysisAmbientSoundHasNois(AnalysisAmbientSoundHasNoise analysisAmbientSoundHasNois) {
	// 	getAnalysisAmbientSoundHasNoises().remove(analysisAmbientSoundHasNois);
	// 	analysisAmbientSoundHasNois.setAudioPostProduction(null);

	// 	return analysisAmbientSoundHasNois;
	// }

	// public List<AnalysisAmbientSoundHasSoundEffect> getAnalysisAmbientSoundHasSoundEffects() {
	// 	return this.analysisAmbientSoundHasSoundEffects;
	// }

	// public void setAnalysisAmbientSoundHasSoundEffects(List<AnalysisAmbientSoundHasSoundEffect> analysisAmbientSoundHasSoundEffects) {
	// 	this.analysisAmbientSoundHasSoundEffects = analysisAmbientSoundHasSoundEffects;
	// }

	// public AnalysisAmbientSoundHasSoundEffect addAnalysisAmbientSoundHasSoundEffect(AnalysisAmbientSoundHasSoundEffect analysisAmbientSoundHasSoundEffect) {
	// 	getAnalysisAmbientSoundHasSoundEffects().add(analysisAmbientSoundHasSoundEffect);
	// 	analysisAmbientSoundHasSoundEffect.setAudioPostProduction(this);

	// 	return analysisAmbientSoundHasSoundEffect;
	// }

	// public AnalysisAmbientSoundHasSoundEffect removeAnalysisAmbientSoundHasSoundEffect(AnalysisAmbientSoundHasSoundEffect analysisAmbientSoundHasSoundEffect) {
	// 	getAnalysisAmbientSoundHasSoundEffects().remove(analysisAmbientSoundHasSoundEffect);
	// 	analysisAmbientSoundHasSoundEffect.setAudioPostProduction(null);

	// 	return analysisAmbientSoundHasSoundEffect;
	// }

	// public List<AnalysisMusic> getAnalysisMusics() {
	// 	return this.analysisMusics;
	// }

	// public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
	// 	this.analysisMusics = analysisMusics;
	// }

	// public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusics().add(analysisMusic);
	// 	analysisMusic.setAudioPostProduction(this);

	// 	return analysisMusic;
	// }

	// public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusics().remove(analysisMusic);
	// 	analysisMusic.setAudioPostProduction(null);

	// 	return analysisMusic;
	// }

	public List<AnalysisSpeech> getAnalysisSpeeches() {
		return this.analysisSpeeches;
	}

	public void setAnalysisSpeeches(List<AnalysisSpeech> analysisSpeeches) {
		this.analysisSpeeches = analysisSpeeches;
	}

	public AnalysisSpeech addAnalysisSpeech(AnalysisSpeech analysisSpeech) {
		getAnalysisSpeeches().add(analysisSpeech);
		analysisSpeech.setAudioPostProduction(this);

		return analysisSpeech;
	}

	public AnalysisSpeech removeAnalysisSpeech(AnalysisSpeech analysisSpeech) {
		getAnalysisSpeeches().remove(analysisSpeech);
		analysisSpeech.setAudioPostProduction(null);

		return analysisSpeech;
	}

	// public List<AnalysisVoice> getAnalysisVoices() {
	// 	return this.analysisVoices;
	// }

	// public void setAnalysisVoices(List<AnalysisVoice> analysisVoices) {
	// 	this.analysisVoices = analysisVoices;
	// }

	// public AnalysisVoice addAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	getAnalysisVoices().add(analysisVoice);
	// 	analysisVoice.setAudioPostProduction(this);

	// 	return analysisVoice;
	// }

	// public AnalysisVoice removeAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	getAnalysisVoices().remove(analysisVoice);
	// 	analysisVoice.setAudioPostProduction(null);

	// 	return analysisVoice;
	// }

	public List<AudioPostProductionTranslation> getAudioPostProductionTranslations() {
		return this.audioPostProductionTranslations;
	}

	public void setAudioPostProductionTranslations(List<AudioPostProductionTranslation> audioPostProductionTranslations) {
		this.audioPostProductionTranslations = audioPostProductionTranslations;
	}

	public AudioPostProductionTranslation addAudioPostProductionTranslation(AudioPostProductionTranslation audioPostProductionTranslation) {
		getAudioPostProductionTranslations().add(audioPostProductionTranslation);
		audioPostProductionTranslation.setAudioPostProduction(this);

		return audioPostProductionTranslation;
	}

	public AudioPostProductionTranslation removeAudioPostProductionTranslation(AudioPostProductionTranslation audioPostProductionTranslation) {
		getAudioPostProductionTranslations().remove(audioPostProductionTranslation);
		audioPostProductionTranslation.setAudioPostProduction(null);

		return audioPostProductionTranslation;
	}

}