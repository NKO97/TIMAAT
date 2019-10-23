package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;


/**
 * The persistent class for the analysis_content_audio database table.
 * 
 */
@Entity
@Table(name="analysis_content_audio")
@NamedQuery(name="AnalysisContentAudio.findAll", query="SELECT a FROM AnalysisContentAudio a")
public class AnalysisContentAudio implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisAmbientSound
	// @OneToMany(mappedBy="analysisContentAudio")
	// private List<AnalysisAmbientSound> analysisAmbientSounds;

	//bi-directional many-to-one association to MediumText
	@ManyToOne
	@JoinColumn(name="medium_text_medium_id")
	@JsonBackReference(value = "MediumText-AnalysisContentAudio")
	private MediumText mediumText;

	//bi-directional many-to-many association to LineupMember
	// @ManyToMany(mappedBy="analysisContentAudios")
	// private List<LineupMember> lineupMembers;

	//bi-directional many-to-one association to AnalysisMusic
	// @OneToMany(mappedBy="analysisContentAudio")
	// private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to AnalysisSpeech
	// @OneToMany(mappedBy="analysisContentAudio")
	// private List<AnalysisSpeech> analysisSpeeches;

	//bi-directional many-to-one association to AnalysisVoice
	// @OneToMany(mappedBy="analysisContentAudio")
	// private List<AnalysisVoice> analysisVoices;

	//bi-directional many-to-one association to Annotation
	@OneToMany(mappedBy="analysisContentAudio")
	@JsonManagedReference(value = "AnalysisContentAudio-Annotation")
	private List<Annotation> annotations;

	public AnalysisContentAudio() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	// public List<AnalysisAmbientSound> getAnalysisAmbientSounds() {
	// 	return this.analysisAmbientSounds;
	// }

	// public void setAnalysisAmbientSounds(List<AnalysisAmbientSound> analysisAmbientSounds) {
	// 	this.analysisAmbientSounds = analysisAmbientSounds;
	// }

	// public AnalysisAmbientSound addAnalysisAmbientSound(AnalysisAmbientSound analysisAmbientSound) {
	// 	getAnalysisAmbientSounds().add(analysisAmbientSound);
	// 	analysisAmbientSound.setAnalysisContentAudio(this);

	// 	return analysisAmbientSound;
	// }

	// public AnalysisAmbientSound removeAnalysisAmbientSound(AnalysisAmbientSound analysisAmbientSound) {
	// 	getAnalysisAmbientSounds().remove(analysisAmbientSound);
	// 	analysisAmbientSound.setAnalysisContentAudio(null);

	// 	return analysisAmbientSound;
	// }

	public MediumText getMediumText() {
		return this.mediumText;
	}

	public void setMediumText(MediumText mediumText) {
		this.mediumText = mediumText;
	}

	// public List<LineupMember> getLineupMembers() {
	// 	return this.lineupMembers;
	// }

	// public void setLineupMembers(List<LineupMember> lineupMembers) {
	// 	this.lineupMembers = lineupMembers;
	// }

	// public List<AnalysisMusic> getAnalysisMusics() {
	// 	return this.analysisMusics;
	// }

	// public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
	// 	this.analysisMusics = analysisMusics;
	// }

	// public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusics().add(analysisMusic);
	// 	analysisMusic.setAnalysisContentAudio(this);

	// 	return analysisMusic;
	// }

	// public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
	// 	getAnalysisMusics().remove(analysisMusic);
	// 	analysisMusic.setAnalysisContentAudio(null);

	// 	return analysisMusic;
	// }

	// public List<AnalysisSpeech> getAnalysisSpeeches() {
	// 	return this.analysisSpeeches;
	// }

	// public void setAnalysisSpeeches(List<AnalysisSpeech> analysisSpeeches) {
	// 	this.analysisSpeeches = analysisSpeeches;
	// }

	// public AnalysisSpeech addAnalysisSpeech(AnalysisSpeech analysisSpeech) {
	// 	getAnalysisSpeeches().add(analysisSpeech);
	// 	analysisSpeech.setAnalysisContentAudio(this);

	// 	return analysisSpeech;
	// }

	// public AnalysisSpeech removeAnalysisSpeech(AnalysisSpeech analysisSpeech) {
	// 	getAnalysisSpeeches().remove(analysisSpeech);
	// 	analysisSpeech.setAnalysisContentAudio(null);

	// 	return analysisSpeech;
	// }

	// public List<AnalysisVoice> getAnalysisVoices() {
	// 	return this.analysisVoices;
	// }

	// public void setAnalysisVoices(List<AnalysisVoice> analysisVoices) {
	// 	this.analysisVoices = analysisVoices;
	// }

	// public AnalysisVoice addAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	getAnalysisVoices().add(analysisVoice);
	// 	analysisVoice.setAnalysisContentAudio(this);

	// 	return analysisVoice;
	// }

	// public AnalysisVoice removeAnalysisVoice(AnalysisVoice analysisVoice) {
	// 	getAnalysisVoices().remove(analysisVoice);
	// 	analysisVoice.setAnalysisContentAudio(null);

	// 	return analysisVoice;
	// }

	public List<Annotation> getAnnotations() {
		return this.annotations;
	}

	public void setAnnotations(List<Annotation> annotations) {
		this.annotations = annotations;
	}

	public Annotation addAnnotation(Annotation annotation) {
		getAnnotations().add(annotation);
		annotation.setAnalysisContentAudio(this);

		return annotation;
	}

	public Annotation removeAnnotation(Annotation annotation) {
		getAnnotations().remove(annotation);
		annotation.setAnalysisContentAudio(null);

		return annotation;
	}

}