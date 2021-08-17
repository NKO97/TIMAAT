package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the change_in_tempo database table.
 * 
 */
@Entity
@Table(name="change_in_tempo")
@NamedQuery(name="ChangeInTempo.findAll", query="SELECT c FROM ChangeInTempo c")
public class ChangeInTempo implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="changeInTempo")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to ChangeInTempoTranslation
	@OneToMany(mappedBy="changeInTempo")
	private List<ChangeInTempoTranslation> changeInTempoTranslations;

	public ChangeInTempo() {
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
		analysisMusic.setChangeInTempo(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
		analysisMusic.setChangeInTempo(null);

		return analysisMusic;
	}

	public List<ChangeInTempoTranslation> getChangeInTempoTranslations() {
		return this.changeInTempoTranslations;
	}

	public void setChangeInTempoTranslations(List<ChangeInTempoTranslation> changeInTempoTranslations) {
		this.changeInTempoTranslations = changeInTempoTranslations;
	}

	public ChangeInTempoTranslation addChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
		getChangeInTempoTranslations().add(changeInTempoTranslation);
		changeInTempoTranslation.setChangeInTempo(this);

		return changeInTempoTranslation;
	}

	public ChangeInTempoTranslation removeChangeInTempoTranslation(ChangeInTempoTranslation changeInTempoTranslation) {
		getChangeInTempoTranslations().remove(changeInTempoTranslation);
		changeInTempoTranslation.setChangeInTempo(null);

		return changeInTempoTranslation;
	}

}