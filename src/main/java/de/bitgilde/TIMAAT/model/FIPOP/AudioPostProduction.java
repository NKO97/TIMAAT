package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

/*
 Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

/**
 * The persistent class for the audio_post_production database table.
 *
 * @author Mirko Scherf <mscherf@uni-mainz.de>
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
	// private List<AnalysisMusic> analysisMusicList;

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

	// public List<AnalysisMusic> getAnalysisMusicList() {
	// 	return this.analysisMusicList;
	// }

	// public void setAnalysisMusicList(List<AnalysisMusic> analysisMusicList) {
	// 	this.analysisMusicList = analysisMusicList;
	// }

	// public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusicList().add(analysisMusic);
	// 	analysisMusic.setAudioPostProduction(this);

	// 	return analysisMusic;
	// }

	// public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusicList().remove(analysisMusic);
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