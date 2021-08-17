package de.bitgilde.TIMAAT.model.FIPOP;

import java.io.Serializable;
import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;


/**
 * The persistent class for the dynamic_marking database table.
 * 
 */
@Entity
@Table(name="dynamic_marking")
@NamedQuery(name="DynamicMarking.findAll", query="SELECT d FROM DynamicMarking d")
public class DynamicMarking implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	//bi-directional many-to-one association to AnalysisMusic
	@OneToMany(mappedBy="dynamicMarking")
	@JsonIgnore
	private List<AnalysisMusic> analysisMusics;

	//bi-directional many-to-one association to DynamicMarkingTranslation
	@OneToMany(mappedBy="dynamicMarking")
	private List<DynamicMarkingTranslation> dynamicMarkingTranslations;

	public DynamicMarking() {
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
		analysisMusic.setDynamicMarking(this);

		return analysisMusic;
	}

	public AnalysisMusic removeAnalysisMusic(AnalysisMusic analysisMusic) {
		getAnalysisMusics().remove(analysisMusic);
		analysisMusic.setDynamicMarking(null);

		return analysisMusic;
	}

	public List<DynamicMarkingTranslation> getDynamicMarkingTranslations() {
		return this.dynamicMarkingTranslations;
	}

	public void setDynamicMarkingTranslations(List<DynamicMarkingTranslation> dynamicMarkingTranslations) {
		this.dynamicMarkingTranslations = dynamicMarkingTranslations;
	}

	public DynamicMarkingTranslation addDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
		getDynamicMarkingTranslations().add(dynamicMarkingTranslation);
		dynamicMarkingTranslation.setDynamicMarking(this);

		return dynamicMarkingTranslation;
	}

	public DynamicMarkingTranslation removeDynamicMarkingTranslation(DynamicMarkingTranslation dynamicMarkingTranslation) {
		getDynamicMarkingTranslations().remove(dynamicMarkingTranslation);
		dynamicMarkingTranslation.setDynamicMarking(null);

		return dynamicMarkingTranslation;
	}

}