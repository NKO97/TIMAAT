package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the tempo_marking database table.
 * 
 */
@Entity
@Table(name="tempo_marking")
@NamedQuery(name="TempoMarking.findAll", query="SELECT t FROM TempoMarking t")
public class TempoMarking implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="tempoMarking")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to TempoMarkingTranslation
	@OneToMany(mappedBy="tempoMarking")
	private List<TempoMarkingTranslation> tempoMarkingTranslations;

	public TempoMarking() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public List<AnalysisMusic> getAnalysisMusics() {
		return this.analysisMusics;
	}

	public void setAnalysisMusics(List<AnalysisMusic> analysisMusics) {
		this.analysisMusics = analysisMusics;
	}

	public AnalysisMusic addAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().add(analysisMusic);
		analysisMusic.setTempoMarking(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
		analysisMusic.setTempoMarking(null);

		return analysisMusic;
	}

	public List<TempoMarkingTranslation> getTempoMarkingTranslations() {
		return this.tempoMarkingTranslations;
	}

	public void setTempoMarkingTranslations(List<TempoMarkingTranslation> tempoMarkingTranslations) {
		this.tempoMarkingTranslations = tempoMarkingTranslations;
	}

	public TempoMarkingTranslation addTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
		getTempoMarkingTranslations().add(tempoMarkingTranslation);
		tempoMarkingTranslation.setTempoMarking(this);

		return tempoMarkingTranslation;
	}

	public TempoMarkingTranslation removeTempoMarkingTranslation(TempoMarkingTranslation tempoMarkingTranslation) {
		getTempoMarkingTranslations().remove(tempoMarkingTranslation);
		tempoMarkingTranslation.setTempoMarking(null);

		return tempoMarkingTranslation;
	}

}